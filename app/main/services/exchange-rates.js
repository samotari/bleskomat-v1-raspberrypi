const _ = require('underscore');
const async = require('async');
const db = require('./db');
const https = require('https');
const logger = require('../logger');

module.exports = {
	defaultOptions: {
		cache: {
			key: 'exchange-rates',
			maxAge: 5 * 60 * 1000,
		},
		currencies: {
			from: null,
			to: null,
		},
		retry: {
			// See https://caolan.github.io/async/v3/docs.html#retry
			errorFilter: function(error) {
				if (error instanceof Error) return false;
				if (!_.isUndefined(error.status)) {
					if (error.status === 0) return false;
					if (error.status >= 400 && error.status <= 499) return false;
				}
				return true;
			},
			interval: 5000,
			times: 3,
		},
		provider: null,
	},
	get: function(options, done) {
		if (_.isFunction(options)) {
			done = options;
			options = {};
		}
		options = _.defaults(options || {}, this.defaultOptions);
		const cacheOptions = _.extend({}, options.cache);
		cacheOptions.key += '-' + JSON.stringify(_.pick(options, 'provider', 'currencies'));
		this.getFromCache(cacheOptions, (error, fromCache, expired) => {
			if (error) return done(error);
			if (fromCache && !expired) return done(null, fromCache);
			this.fetch(
				options,
				(error, result) => {
					if (error || !result) {
						if (error) {
							logger.error(error);
						}
						error = new Error(
							this.formatText(
								'Unsupported currency pair: "{{from}}_{{to}}"',
								options.currencies,
							),
						);
						return done(error);
					}
					if (!result) {
						return done();
					}
					result = result.toString();
					cacheOptions.exists = !!fromCache;
					this.saveToCache(cacheOptions, result, (error) => {
						if (error) logger.error(error);
						done(null, result);
					});
				},
			);
		});
	},
	getFromCache: function(options, done) {
		db('cache')
			.where('key', options.key)
			.limit(1)
			.then((result) => {
				const row = result && result[0];
				if (!row) return done();
				const expired = options.maxAge && row.updated_at < Date.now() - options.maxAge;
				done(null, row.data, expired);
			})
			.catch(done);
	},
	saveToCache: function(options, data, done) {
		if (options.exists) {
			db('cache')
				.where('key', options.key)
				.update({
					data: data,
					updated_at: Date.now(),
				})
				.then(function() {
					done();
				})
				.catch(done);
		} else {
			db('cache')
				.insert({
					key: options.key,
					data: data,
					created_at: Date.now(),
					updated_at: Date.now(),
				})
				.then(function() {
					done();
				})
				.catch(done);
		}
	},
	fetch: function(options, done) {
		if (_.isFunction(options)) {
			done = options;
			options = {};
		}
		options = _.defaults(options || {}, this.defaultOptions);
		if (!options.currencies) {
			return done(new Error('Missing required option: "currencies"'));
		}
		if (!_.isObject(options.currencies)) {
			return done(new Error('Invalid option ("currencies"): Object expected'));
		}
		if (!_.isString(options.currencies.from)) {
			return done(
				new Error('Invalid option ("currencies.from"): String expected'),
			);
		}
		if (!_.isString(options.currencies.to)) {
			return done(
				new Error('Invalid option ("currencies.to"): String expected'),
			);
		}
		if (!options.provider) {
			return done(new Error('Missing required option: "provider"'));
		}
		if (!_.isString(options.provider)) {
			return done(new Error('Invalid option ("provider"): String expected'));
		}
		this.getRateFromProvider(options.provider, options, done);
	},
	getRateFromProvider: function(providerName, options, done) {
		try {
			this.checkProviderOptions(providerName);
			const provider = this.getProvider(providerName);
			let currencies = {};
			_.each(options.currencies, function(symbol, key) {
				if (provider.convertSymbols && provider.convertSymbols[symbol]) {
					symbol = provider.convertSymbols[symbol];
				}
				currencies[key.toLowerCase()] = symbol.toLowerCase();
				currencies[key.toUpperCase()] = symbol.toUpperCase();
			});
			const uri = this.formatText(provider.url, currencies);
			let jsonPath = _.mapObject(
				provider.jsonPath,
				function(path) {
					return this.formatText(path, currencies);
				},
				this,
			);
			let parseResponseBody = (body) => {
				try {
					let data = JSON.parse(body);
					if (jsonPath.error) {
						let error = this.getValueAtPath(data, jsonPath.error);
						if (!_.isEmpty(error)) {
							return { error: error };
						}
					}
					let result = this.getValueAtPath(data, jsonPath.data);
					if (_.isUndefined(result)) {
						return { result: null };
					}
					return { result: result };
				} catch (error) {
					return { error: error };
				}
			};
			async.retry(
				options.retry,
				function(next) {
					try {
						const req = https.request(uri, function(res) {
							let body = '';
							res.on('data', function(data) {
								body += data.toString();
							});
							res.on('end', function() {
								let data = parseResponseBody(body);
								if (data.error) return next(new Error(data.error));
								next(null, data.result);
							});
						});
						req.on('error', error => {
							next(error);
						});
						req.end();
					} catch (error) {
						return next(error);
					}
				},
				done,
			);
		} catch (error) {
			return done(error);
		}
	},
	checkProviderOptions: function(providerName) {
		const provider = this.getProvider(providerName);
		if (!provider) {
			throw new Error('Unknown provider: "' + providerName + '"');
		}
		if (!provider.url) {
			throw new Error('Missing provider config: "url"');
		}
		if (!provider.jsonPath) {
			throw new Error('Missing provider config: "jsonPath"');
		}
		if (!_.isObject(provider.jsonPath)) {
			throw new Error('Invalid provider config ("jsonPath"): Object expected');
		}
		if (
			!_.isUndefined(provider.convertSymbols) &&
			!_.isObject(provider.convertSymbols)
		) {
			throw new Error(
				'Invalid provider config ("convertSymbols"): Object expected',
			);
		}
	},
	getValueAtPath: function(data, path) {
		// Deep clone to prevent mutation of original data object.
		data = JSON.parse(JSON.stringify(data));
		let parts = path.split('.');
		let key;
		while (
			!_.isUndefined(data) &&
			_.isObject(data) &&
			parts.length > 0 &&
			(key = parts.shift())
		) {
			data = data[key];
		}
		return data;
	},
	getProvider: function(providerName) {
		return this.providers[providerName] || null;
	},
	formatText: function(text, data) {
		_.chain(data)
			.pick('from', 'to', 'FROM', 'TO')
			.each(function(value, key) {
				text = text.replace(`{{${key}}}`, value);
			});
		return text;
	},
	providers: {
		binance: {
			label: 'Binance',
			url: 'https://api.binance.com/api/v3/ticker/price?symbol={{FROM}}{{TO}}',
			jsonPath: {
				data: 'price',
			},
			convertSymbols: {
				USD: 'USDT',
			},
		},
		bitfinex: {
			label: 'Bitfinex',
			url: 'https://api.bitfinex.com/v1/pubticker/{{from}}{{to}}',
			jsonPath: {
				error: 'message',
				data: 'last_price',
			},
		},
		bitflyer: {
			label: 'bitFlyer',
			url: 'https://api.bitflyer.com/v1/ticker?product_code={{FROM}}_{{TO}}',
			jsonPath: {
				error: 'error_message',
				data: 'ltp',
			},
		},
		bitstamp: {
			label: 'Bitstamp',
			url: 'https://www.bitstamp.net/api/v2/ticker/{{from}}{{to}}/',
			jsonPath: {
				error: 'message',
				data: 'last',
			},
		},
		coinbase: {
			label: 'Coinbase',
			url: 'https://api.coinbase.com/v2/exchange-rates?currency={{FROM}}',
			jsonPath: {
				error: 'errors',
				data: 'data.rates.{{TO}}',
			},
		},
		coinmate: {
			label: 'CoinMate.io',
			url: 'https://coinmate.io/api/ticker?currencyPair={{FROM}}_{{TO}}',
			jsonPath: {
				error: 'errorMessage',
				data: 'data.last',
			},
		},
		kraken: {
			label: 'Kraken',
			url: 'https://api.kraken.com/0/public/Ticker?pair={{FROM}}{{TO}}',
			convertSymbols: {
				BTC: 'XBT',
			},
			jsonPath: {
				error: 'error',
				data: 'result.X{{FROM}}Z{{TO}}.c.0',
			},
		},
		poloniex: {
			label: 'Poloniex',
			url: 'https://poloniex.com/public?command=returnTicker',
			convertSymbols: {
				USD: 'USDT',
			},
			jsonPath: {
				data: '{{TO}}_{{FROM}}.last',
			},
		},
	},
};
