/*
	!! WARNING !! This is super hacky...

	Problem:
		- `electron-rebuild` rebuilds a module's bindings for the electron environment.
		- These bindings might not work outside of electron - as is the case for "@serialport/bindings".

	Solution:
		- Define a special alias for the "@serialport/bindings" module.
		- Override node's `require` method and force the alias to be used when required by serialport.
*/
const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function() {
	var args = Array.prototype.slice.call(arguments);
	if (typeof args[0] === 'string') {
		switch (args[0]) {
			case '@serialport/bindings':
				args[0] = '@serialport/bindings-dev';
				break;
		}
	}
	return originalRequire.apply(this, args);
};

const _ = require('underscore');
const path = require('path');
const SerialPort = require('serialport');
const config = require('../main/config');
const mockDevicePath = path.join(__dirname, '..', 'dev', 'ttyMOCK1');
const port1 = new SerialPort(mockDevicePath);
const notes = _.chain(config.paperMoneyReader.notes).map(function(note, key) {
	return [key.toString(), [note.amount, note.currency].join(' ')];
}).object().value();

port1.on('error', function(error) {
	console.log(error);
});

const stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');

let keys = '';
stdin.on('data', function(key) {
	if (key === '\u0003') {
		process.exit();
	}
	keys += key;
});

stdin.on('data', _.debounce(function() {
	const note = notes[keys];
	if (!note) {
		console.log(`Keys not recognized: "${keys}"`);
	} else {
		console.log(`Sending "${note}"`);
		port1.write(keys);
	}
	keys = '';
}, 200));

console.log('Below is the full list of notes that are supported by the paper money reader. Type to mock the corresponding serial command as if a note was entered into the machine.');
console.log(JSON.stringify(notes, null, 2));
