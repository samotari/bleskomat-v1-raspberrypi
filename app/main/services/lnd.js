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
	logger.error('ln-service.initialize.error', error);
}

module.exports = {
	initialized,
	parsePaymentRequest(payReq) {
		let decodedPayReq;
		try {
			decodedPayReq = lnService.parsePaymentRequest({ request: payReq });
		} catch (error) {
			logger.error('ln-service.parsePaymentRequest.error', error);
			throw new Error('Failed to decode payment request: ' + error.message);
		}
		logger.info('ln-service.parsePaymentRequest.success', decodedPayReq);
		return decodedPayReq;
	},
	isPayable(decodedPayReq, cb) {
		lnService.isDestinationPayable(
			{
				destination: decodedPayReq.destination,
				routes: decodedPayReq.routes,
				tokens: decodedPayReq.tokens,
				lnd,
			},
			(error, result) => {
				if (error) {
					logger.error('ln-service.isDestinationPayable.error', error);
					return cb(
						new Error('Failed to check if destination payable: ' + error[1]),
					);
				}
				logger.info('ln-service.isDestinationPayable.success', result);
				const isPayable = result && result.is_payable === true;
				cb(null, isPayable);
			},
		);
	},
	pay(decodedPayReq, tokens, cb) {
		if (!initialized) {
			return cb(new Error('LN Service not initialized'));
		}
		if (decodedPayReq.routes && decodedPayReq.routes.length > 0) {
			this.payViaRoutes(decodedPayReq, tokens, cb);
		} else {
			this.payViaPaymentDetails(decodedPayReq, tokens, cb);
		}
	},
	payViaRoutes(decodedPayReq, tokens, cb) {
		if (!initialized) {
			return cb(new Error('LN Service not initialized'));
		}
		let routes = _.sortBy(decodedPayReq.routes || [], route => {
			return _.reduce(
				route,
				(memo, hop) => {
					if (hop.base_fee_mtokens) {
						return memo.plus(hop.base_fee_mtokens);
					}
					return memo;
				},
				new BigNumber(0),
			).toNumber();
		});
		let payment;
		let lastError;
		async.until(
			next => {
				next(null, routes.length === 0 || !!payment);
			},
			next => {
				const route = routes.shift();
				lnService.getRoutes(
					{
						destination: decodedPayReq.destination,
						routes: [route],
						tokens,
						lnd,
					},
					(error, result) => {
						if (!error && result && result.routes && result.routes.length > 0) {
							// Found routes.
							// Try to pay.
							lnService.payViaRoutes(
								{
									id: decodedPayReq.id,
									routes: result.routes,
									lnd,
								},
								(error, result) => {
									if (error) {
										logger.error('ln-service.payViaRoutes.error', error);
									} else if (result && result.secret) {
										// Paid!
										payment = result;
									}
									next();
								},
							);
						} else {
							// Error or failed to find any routes.
							if (error) {
								logger.error('ln-service.getRoutes.error', error);
								lastError = error;
							}
							next();
						}
					},
				);
			},
			() => {
				if (payment) {
					logger.info('ln-service.payViaRoutes.success', payment);
					return cb(null, payment);
				} else if (lastError) {
					return cb(new Error('Payment failed: ' + lastError[1]));
				}
				cb(new Error('Payment failed'));
			},
		);
	},
	payViaPaymentDetails(decodedPayReq, tokens, cb) {
		if (!initialized) {
			return cb(new Error('LN Service not initialized'));
		}
		lnService.payViaPaymentDetails(
			{
				id: decodedPayReq.id,
				destination: decodedPayReq.destination,
				tokens,
				lnd,
			},
			(error, result) => {
				if (error) {
					logger.error('ln-service.payViaPaymentDetails.error', error);
					return cb(new Error('Payment failed: ' + error[1]));
				}
				logger.info('ln-service.payViaPaymentDetails.success', result);
				cb(null, result);
			},
		);
	},
};
