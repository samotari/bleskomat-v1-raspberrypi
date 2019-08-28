module.exports = {
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
};
