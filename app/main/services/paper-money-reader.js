const _ = require('underscore');
const SerialPort = require('serialport');
const config = require('../config');

module.exports = {
	defaultOptions: {
		portPath: config.paperMoneyReader.portPath,
		baudRate: config.paperMoneyReader.baudRate,
	},
	connect: function(options) {
		options = _.defaults(options || {}, this.defaultOptions);
		let port;
		try {
			port = new SerialPort(options.portPath, {
				baudRate: options.baudRate,
			});
		} catch (error) {
			console.error(`there was an eror connecting to port port: ${error}`);
		}
		return {
			port,
		};
	},
};
