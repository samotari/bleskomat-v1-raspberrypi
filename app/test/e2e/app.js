const assert = require('assert');

describe('Application launch', function() {

	it('shows an initial window', function() {
		return this.app.client.getWindowCount().then(function(count) {
			assert.equal(count, 1);
		});
	});

	it('interface has loaded', function() {
		return this.app.client
			.waitForExist('#app')
			.waitForExist('#app header')
			.waitForExist('#app main')
			.waitForExist('#app footer');
	});
});
