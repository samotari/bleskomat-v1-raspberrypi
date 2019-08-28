require('dotenv').config();

module.exports = {
	bitcoinDecimalPlaces: 8,
	supportedCurrencies: [
		{
			BigNumber: {
				FORMAT: {
					decimalSeparator: ',',
					groupSeparator: ' ',
					groupSize: 3,
				},
			},
			decimals: 0,
			provider: 'coinbase',
			symbol: 'CZK',
		},
		{
			BigNumber: {
				FORMAT: {
					decimalSeparator: ',',
					groupSeparator: ' ',
					groupSize: 3,
				},
			},
			decimals: 2,
			provider: 'coinbase',
			symbol: 'EUR',
		},
	],
	paperMoneyReader: {
		portPath: '/dev/ttyACM1',
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
		},
	},
};
