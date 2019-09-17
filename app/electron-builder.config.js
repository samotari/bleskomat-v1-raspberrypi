const _ = require('underscore');
const env = process.env.NODE_ENV || 'dev';

const deepClone = function(obj) {
	return JSON.parse(JSON.stringify(obj));
};

let configs = {
	dev: {
		appId: 'com.github.samotari.bleskomat',
		productName: 'Bleskomat',
		copyright: 'Copyright (C) 2019 the Bleskomat project contributors',
		files: [
			// See:
			// https://www.electron.build/configuration/contents#files
			'index.js',
			'main/**/*',
			'renderer/**/*',
		],
		directories: {
			buildResources: 'build',
			output: 'dist',
			app: '.',
		},
		linux: {
			target: 'deb',
			synopsis: 'The open-source Lightning Network ATM',
			description: '',
		},
	},
};

if (_.contains(process.argv, '--armv7l')) {
	configs.dev.files = configs.dev.files.concat([
		'!node_modules/@serialport/bindings/build/Release/bindings.node',
		{
			from: 'prebuilt/linux-armv7l/node_modules/@serialport/bindings/build/Release',
			to: 'node_modules/@serialport/bindings/build/Release',
			filter: ['bindings.node'],
		},
	]);
}

configs.production = deepClone(configs.dev);

if (!configs[env]) {
	throw new Error(`Unknown environment: '${env}'`);
}

module.exports = configs[env];
