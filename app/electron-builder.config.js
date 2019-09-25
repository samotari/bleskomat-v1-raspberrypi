const _ = require('underscore');
const package = require('./package.json');
const env = process.env.NODE_ENV || 'dev';

const deepClone = function(obj) {
	return JSON.parse(JSON.stringify(obj));
};

let configs = {
	dev: {
		appId: package.app.id,
		productName: package.app.name,
		copyright: package.app.copyright,
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
			synopsis: package.description,
			description: package.description,
		},
	},
};

if (_.contains(process.argv, '--armv7l')) {
	configs.dev.files = configs.dev.files.concat([
		'!node_modules/@serialport/bindings/build/Release/bindings.node',
		{
			from:
				'prebuilt/linux-armv7l/node_modules/@serialport/bindings/build/Release',
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
