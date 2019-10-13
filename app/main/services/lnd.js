const _ = require('underscore');
const async = require('async');
const BigNumber = require('bignumber.js');
const fs = require('fs');
const lnService = require('ln-service');

const config = require('../config');
const logger = require('../logger');

let initialized = false;
let lnd;
try {
	const lnConfig = {
		cert: fs.readFileSync(config.lnd.cert, 'base64'),
		macaroon: fs.readFileSync(config.lnd.macaroon, 'base64'),
		socket: config.lnd.host,
	};
	lnd = lnService.authenticatedLndGrpc(lnConfig).lnd;
	initialized = true;
} catch (error) {
	logger.error('Failed to initialize LN Service', error);
}

module.exports = {
	decodePaymentRequest: function(payReq, cb) {
		if (!initialized) {
			return cb(new Error('LN Service not initialized'));
		}
		lnService.decodePaymentRequest({
			request: payReq,
			lnd,
		}, cb);
	},
	payExtraToDecodedPaymentRequest: function(decodedPayReq, newAmount, cb) {
		if (!initialized) {
			return cb(new Error('LN Service not initialized'));
		}
		let routes = _.sortBy(decodedPayReq.routes, function(route) {
			return _.reduce(route, function(memo, hop) {
				if (hop.base_fee_mtokens) {
					return memo.plus(hop.base_fee_mtokens);
				}
				return memo;
			}, new BigNumber(0)).toNumber();
		});
		let payment;
		async.until(function(next) {
			next(null, routes.length === 0 || !!payment);
		}, function(next) {
			const route = routes.shift();
			lnService.getRoutes({
				destination: decodedPayReq.destination,
				routes: [route],
				tokens: newAmount,
				lnd,
			}, function(error, result) {
				if (!error && result && result.routes && result.routes.length > 0) {
					// Found routes.
					// Try to pay.
					lnService.payViaRoutes({
						id: decodedPayReq.id,
						routes: result.routes,
						lnd,
					}, function(error, result) {
						if (error) {
							logger.info(error);
						} else if (result && result.secret) {
							// Paid!
							payment = result;
						}
						next();
					});
				} else {
					// Error or failed to find any routes.
					if (error) {
						logger.info(error);
					}
					next();
				}
			});
		}, function() {
			if (payment) {
				cb(null, payment);
			} else {
				cb(new Error('Failed to find path to destination'));
			}
		});
	},
};
