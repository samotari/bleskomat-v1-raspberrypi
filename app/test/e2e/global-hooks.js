const Application = require('spectron').Application;
const electron = require('electron');
const path = require('path');

before(function() {
	this.timeout(10000);
	this.app = new Application({
		env: {
			NODE_ENV: 'test',
		},
		// Your electron path can be any binary
		// i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
		// But for the sake of the example we fetch it from our node_modules.
		path: electron,
		// The following line tells spectron to look and use the main.js file
		// and the package.json located 1 level above.
		args: [path.join(__dirname, '..', '..')],
	});
	return this.app.start();
});

after(function() {
	// Uncomment the following lines to get and print console logs from the app process.
	// setTimeout(() => {
	// 	this.app.client.getMainProcessLogs().then(console.log);
	// }, 100);
	if (this.app && this.app.isRunning()) {
		return this.app.stop();
	}
});
