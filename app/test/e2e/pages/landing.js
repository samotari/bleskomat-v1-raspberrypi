const assert = require('assert');

describe('Page: Landing', function() {

	it('landing page is the first screen', function() {
		return this.app.client
			.waitForExist('#app[data-page="landing"]');
	});

	it('"Get Started" button exists', function() {
		return this.app.client
			.waitForExist('button')
			.getText('button').then(function(text) {
				assert.strictEqual(text, 'Get Started');
			});
	});

	it('Clicking "Get Started" button loads Scan Invoice page', function() {
		return this.app.client
			.waitForExist('button')
			.click('button')
			.waitForExist('#app[data-page="scan-invoice"]');
	});
});
