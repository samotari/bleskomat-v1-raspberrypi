const path = require('path');
const winston = require('winston');
const config = require('./config');

const logger = (module.exports = winston.createLogger({
	level: 'info',
	format: winston.format.combine(
		winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		winston.format.simple(),
	),
	transports: [],
}));

switch (config.env) {
	case 'production':
		logger.add(
			//
			// - Write to all logs with level `info` and below to `combined.log`
			// - Write all logs error (and below) to `error.log`.
			//
			new winston.transports.File({
				filename: path.join(config.logsPath, 'error.log'),
				level: 'error',
			}),
		);
		logger.add(
			new winston.transports.File({
				filename: path.join(config.logsPath, 'combined.log'),
			}),
		);
		break;
	default:
		//
		// If we're not in production then log to the `console` with the format:
		// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
		//
		logger.add(
			new winston.transports.Console({
				format: winston.format.simple(),
			}),
		);
		break;
}

// Don't use winston logger when the process is exiting.
process.on('exit', function() {
	logger.error = function() { console.log.apply(console, arguments); };
	logger.info = function() { console.log.apply(console, arguments); };
});
