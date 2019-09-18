const _ = require('underscore');
const async = require('async');
const BigNumber = require('bignumber.js');
const { app, BrowserWindow, ipcMain } = require('electron');
const config = require('./config');
const path = require('path');
const services = require('./services');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
	// Create the browser window.
	win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			// This script will be loaded before other scripts run in the page. It will always have
			// access to node APIs no matter whether node integration is turned on or off. The value
			// should be the absolute file path to the script. When node integration is turned off,
			// the preload script can reintroduce Node global symbols back to the global scope.
			preload: path.join(config.appPath, 'main', 'preload.js'),
		},
	});

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

let ratesStored;
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
					console.log(error); // eslint-disable-line no-console
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
			ratesStored = results;
			const rates = _.chain(results)
				.compact()
				.map(function(result) {
					let value;
					try {
						BigNumber.config(result.currency.BigNumber);
						// Invert the rate then apply currency-specific formatting.
						value = new BigNumber(result.rate)
							.toFormat(result.currency.decimals)
							.toString();
					} catch (error) {
						console.log(error); // eslint-disable-line no-console
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

ipcMain.on('start-receiving-bill-notes', event => {
	const paperMoney = config.paperMoneyReader.notes;
	const { port } = services.paperMoneyReader.connect();

	let eur = new BigNumber(0);
	let czk = new BigNumber(0);

	port.on('data', data => {
		const command = data.toString();
		const inserted = paperMoney[command];
		const czk2btc = _.find(ratesStored, rate => rate.currency.symbol === 'CZK');
		const eur2btc = _.find(ratesStored, rate => rate.currency.symbol === 'EUR');

		if (inserted) {
			if (inserted.currency === 'EUR') {
				eur = eur.plus(Number(inserted.amount));
			}
			if (inserted.currency === 'CZK') {
				czk = czk.plus(inserted.amount);
			}

			const eurInBtc = eur.dividedBy(eur2btc.rate);
			const czkInBtc = czk.dividedBy(czk2btc.rate);

			const totalBtc = czkInBtc.plus(eurInBtc);
			event.reply('received-bill-note', {
				eur: eur.toString(),
				czk: czk.toString(),
				totalBtc: totalBtc.toFixed(config.bitcoinDecimalPlaces),
			});
		}
	});
});

ipcMain.on('lnd', function(event, service, method, payload) {
	payload = payload || {};
	services.lnd.exec(service, method, payload, function(error, result) {
		if (error) {
			console.log(error); // eslint-disable-line no-console
			event.reply(`lnd.${service}.${method}.error`);
		} else {
			event.reply(`lnd.${service}.${method}`, result);
		}
	});
});
