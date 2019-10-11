const { app } = require('electron');
require('dotenv').config();
const path = require('path');

if (app) {
	app.setAppLogsPath();
}

module.exports = {
	env: process.env.NODE_ENV || 'dev',
	appPath: (app && app.getAppPath()) || null,
	logsPath: (app && app.getPath('logs')) || null,
	db: {
		knex: {
			client: 'sqlite3',
			connection: {
				filename: (app && path.join(app.getPath('userData'), 'bleskomat.db.sqlite3')) || ':memory:',
			},
			useNullAsDefault: true,
		},
	},
	lnd: {
		host: process.env.BLESKOMAT_LND_HOST,
		cert: process.env.BLESKOMAT_LND_CERT,
		macaroon: process.env.BLESKOMAT_LND_MACAROON,
	},
	lightning: {
		finalCltvDelta: 144,
	},
	exchangeProcess: {
		fee: process.env.BLESKOMAT_FEE || 0,
	},
	format: {
		numbers: {
			BigNumber: {
				FORMAT: {
					decimalSeparator: '.',
					groupSeparator: ',',
					groupSize: 3,
				},
			},
			decimals: 0,
		},
	},
	supportedCurrencies: [
		{
			provider: 'coinbase',
			symbol: 'CZK',
		},
		{
			provider: 'coinbase',
			symbol: 'EUR',
		},
	],
	paperMoneyReader: {
		portPath: process.env.BLESKOMAT_PAPER_MONEY_READER_DEVICE || '/dev/ttyACM1',
		baudRate: 9600,
		notes: {
			1: {
				amount: 5,
				currency: 'EUR',
			},
			2: {
				amount: 10,
				currency: 'EUR',
			},
			3: {
				amount: 20,
				currency: 'EUR',
			},
			4: {
				amount: 50,
				currency: 'EUR',
			},
			5: {
				amount: 100,
				currency: 'EUR',
			},
			6: {
				amount: 200,
				currency: 'EUR',
			},
			7: {
				amount: 100,
				currency: 'CZK',
			},
			8: {
				amount: 200,
				currency: 'CZK',
			},
			9: {
				amount: 500,
				currency: 'CZK',
			},
			10: {
				amount: 1000,
				currency: 'CZK',
			},
			11: {
				amount: 2000,
				currency: 'CZK',
			},
			12: {
				amount: 5000,
				currency: 'CZK',
			},
			99: {
				amount: '0.01',
				currency: 'EUR',
			},
		},
	},
};
