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
		const port = new SerialPort(options.portPath, {
			baudRate: options.baudRate,
		});
		port.on('error', function(error) {
			console.log(`Error while opening port: ${error}`);
		});
		return {
			port,
		};
	},
};
