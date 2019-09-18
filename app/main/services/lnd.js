const _ = require('underscore');
const async = require('async');
const LndGrpc = require('lnd-grpc');
const config = require('../config');
const grpc = new LndGrpc(config.lnd);

let hasAllRequiredConfigs = true;
_.each(['host', 'cert', 'macaroon'], function(key) {
	if (!config.lnd[key]) {
		hasAllRequiredConfigs = false;
		console.log(`Missing required config: "lnd.${key}"`); // eslint-disable-line no-console
	}
});

const LndService = (module.exports = {
	grpcWhiteList: {
		Lightning: ['decodePayReq', 'getInfo', 'sendPaymentSync'],
	},
	onReady: function(fn) {
		this.queues.exec.push({ fn: fn });
	},
	exec: function(service, method, payload, done) {
		if (!this.isConfigured()) {
			return done(new Error('lnd.service not configured'));
		}
		this.onReady(() => {
			if (!this.isWhiteListed(service, method)) {
				return done(
					new Error(
						`Disallowed or unknown service/method: ${service}/${method}`,
					),
				);
			}
			if (_.isFunction(payload)) {
				done = payload;
				payload = {};
			}
			grpc.services[service][method](payload)
				.then(function(result) {
					done(null, result);
				})
				.catch(done);
		});
	},
	isWhiteListed: function(service, method) {
		return (
			!!this.grpcWhiteList[service] &&
			_.contains(this.grpcWhiteList[service], method)
		);
	},
	isConfigured: function() {
		return hasAllRequiredConfigs;
	},
	isActive: function() {
		return grpc.state === 'active';
	},
	initialize: function() {
		this.prepareQueues();
		this.pauseQueues();
		if (this.isConfigured()) {
			grpc.on('locked', () => {
				this.queues.exec.pause();
			});
			grpc.on('disconnected', () => {
				this.queues.exec.pause();
			});
			grpc.on('active', () => {
				this.queues.exec.resume();
			});
			this.connect(error => {
				if (error) {
					console.log(error); // eslint-disable-line no-console
				} else if (this.isActive()) {
					this.queues.exec.resume();
				}
			});
		}
	},
	connect: function(done) {
		grpc
			.connect()
			.then(function() {
				done();
			})
			.catch(done);
	},
	queues: {},
	prepareQueues: function() {
		this.queues = {
			exec: async.queue(function(task, next) {
				try {
					task.fn();
				} catch (error) {
					console.log(error); // eslint-disable-line no-console
				}
				next();
			}, 1 /* concurrency */),
		};
	},
	pauseQueues: function() {
		// Pause all queues.
		// This prevents execution of queued items until queue.resume() is called.
		_.invoke(this.queues, 'pause');
	},
});

LndService.initialize();

// LndService.exec('Lightning', 'getInfo', function() {
// 	console.log(arguments); // eslint-disable-line no-console
// });

// LndService.exec('Lightning', 'decodePayReq', { pay_req }, function() {
// 	console.log(arguments); // eslint-disable-line no-console
// });

// LndService.exec('Lightning', 'sendPaymentSync', { payment_request: pay_req }, function() {
// 	console.log(arguments); // eslint-disable-line no-console
// });
