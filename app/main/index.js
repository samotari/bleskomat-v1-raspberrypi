const _ = require('underscore');
const async = require('async');
const BigNumber = require('bignumber.js');
const { app, BrowserWindow, ipcMain } = require('electron');
const config = require('./config');
const path = require('path');
const services = require('./services');
const logger = require('./logger');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
const fullscreen = config.env !== 'dev';

function createWindow() {
	// Create the browser window.
	win = new BrowserWindow({
		width: 800,
		height: 480,
		fullscreen: fullscreen,
		webPreferences: {
			// This script will be loaded before other scripts run in the page. It will always have
			// access to node APIs no matter whether node integration is turned on or off. The value
			// should be the absolute file path to the script. When node integration is turned off,
			// the preload script can reintroduce Node global symbols back to the global scope.
			preload: path.join(config.appPath, 'main', 'preload.js'),
		},
	});

	if (fullscreen) {
		win.maximize();
	}

	// and load the index.html of the app.
	const indexFilePath = path.join(
		config.appPath,
		'renderer',
		'dist',
		'index.html',
	);
	win.loadURL(`file://${indexFilePath}`);

	if (config.env === 'dev') {
		// Open the DevTools.
		win.webContents.openDevTools();
	}

	// Emitted when the window is closed.
	win.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		win = null;
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (win === null) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

let exchangeProcess = {
	rates: null,
	payReq: null,
	payReqDecoded: null,
	eur: new BigNumber(0),
	czk: new BigNumber(0),
	find: {
		rate: (symbol) => {
			return _.chain(exchangeProcess.rates)
				.compact()
				.find(
					rate => rate.currency.symbol === symbol
				)
				.value();
		},
	},
	calculate: {
		satoshis: function() {
			const eur2btc = exchangeProcess.find.rate('EUR');
			const czk2btc = exchangeProcess.find.rate('CZK');
			const eurInBtc = exchangeProcess.eur.dividedBy(eur2btc.rate);
			const czkInBtc = exchangeProcess.czk.dividedBy(czk2btc.rate);
			return new BigNumber(czkInBtc)
				.plus(eurInBtc)
				.times(1e8)
				.integerValue(BigNumber.ROUND_DOWN);
		},
		fee: function() {
			const satoshis = exchangeProcess.calculate.satoshis();
			return new BigNumber(satoshis)
				.multipliedBy(config.exchangeProcess.fee)
				.integerValue(BigNumber.ROUND_DOWN);
		},
		satoshisMinusFee: function() {
			const satoshis = exchangeProcess.calculate.satoshis();
			const fee = exchangeProcess.calculate.fee();
			return satoshis.minus(fee).toNumber();
		},
	},
};

ipcMain.on('get-exchange-rates', function(event) {
	async.map(
		config.supportedCurrencies,
		function(currency, next) {
			const options = {
				currencies: {
					from: 'BTC',
					to: currency.symbol,
				},
				provider: currency.provider,
			};
			services.exchangeRates.get(options, function(error, rate) {
				if (error) {
					logger.error(error);
					next(null, null);
				} else {
					next(null, {
						currency: currency,
						rate: rate,
					});
				}
			});
		},
		function(error, results) {
			exchangeProcess.rates = results;
			const rates = _.chain(results)
				.compact()
				.map(function(result) {
					let value;
					try {
						BigNumber.config(config.format.numbers.BigNumber);
						value = new BigNumber(result.rate)
							.toFormat(config.format.numbers.decimals)
							.toString();
					} catch (error) {
						logger.error(error);
						value = result.rate;
					}
					return {
						value: value,
						symbol: result.currency.symbol,
					};
				})
				.value();
			event.reply('exchange-rates', rates);
		},
	);
});

let port;
try {
	port = services.paperMoneyReader.connect().port;
} catch (error) {
	logger.error(error);
}

ipcMain.on('start-receiving-bill-notes', event => {
	logger.info('start-receiving-bill-notes');
	exchangeProcess.eur = new BigNumber(0);
	exchangeProcess.czk = new BigNumber(0);
	port.removeAllListeners('data');
	const notes = config.paperMoneyReader.notes;
	const sendBillNotesUpdate = function() {
		const amountWillReceive = exchangeProcess.calculate.satoshisMinusFee();
		const feeToBePaid = exchangeProcess.calculate.fee();
		const feePercent = new BigNumber(config.exchangeProcess.fee).times(100);
		event.reply('received-bill-note', {
			eur: exchangeProcess.eur.toString(),
			czk: exchangeProcess.czk.toString(),
			amountWillReceive: amountWillReceive.toString(),
			feeToBePaid: feeToBePaid.toString(),
			feePercent: feePercent.toString(),
		});
	};
	port.on('data', data => {
		logger.info('PaperMoneyReader.data:', data);
		let command = data[0];
		logger.info('PaperMoneyReader.command:', command);
		const note = notes[command];
		if (!note) {
			logger.info('PaperMoneyReader: Unrecognized command');
			return;
		}
		logger.info('PaperMoneyReader.note:', JSON.stringify(note));
		if (note) {
			if (note.currency === 'EUR') {
				exchangeProcess.eur = exchangeProcess.eur.plus(note.amount);
			}
			if (note.currency === 'CZK') {
				exchangeProcess.czk = exchangeProcess.czk.plus(note.amount);
			}
		}
		sendBillNotesUpdate();
	});
	sendBillNotesUpdate();
});

ipcMain.on('decode-payreq', (event, payload) => {
	let { pay_req } = payload;
	pay_req = pay_req.toLowerCase();
	if (pay_req.indexOf(':') !== -1) {
		pay_req = pay_req.split(':')[1];
	}
	services.lnd.decodePaymentRequest(pay_req, (error, result) => {
		if (error) {
			logger.error('DecodePaymentRequest.error:', error);
			event.reply('decode-payreq', { error: error });
		} else {
			exchangeProcess.payReq = pay_req;
			exchangeProcess.payReqDecoded = result;
			logger.info('DecodePaymentRequest.success:', result);
			event.reply('decode-payreq', result);
		}
	},
	);
});

ipcMain.on('send-payment', event => {
	const newAmount = exchangeProcess.calculate.satoshisMinusFee();
	services.lnd.payExtraToDecodedPaymentRequest(
		exchangeProcess.payReqDecoded,
		newAmount,
		(error, result) => {
			if (error) {
				logger.info('SendPayment.error:', error);
				event.reply('send-payment', { error: error });
			} else {
				exchangeProcess.payReq = null;
				exchangeProcess.payReqDecoded = null;
				logger.info('SendPayment.success:', result);
				event.reply('send-payment');
			}
		},
	);
});
