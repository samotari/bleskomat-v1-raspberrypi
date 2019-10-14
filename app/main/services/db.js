const config = require('../config');
const logger = require('../logger');
const knex = require('knex')(config.db.knex);
module.exports = knex;

knex.schema.hasTable('cache').then(function(exists) {
	if (!exists) {
		return knex.schema.createTable('cache', function(table) {
			table.string('key');
			table.json('data');
			table.timestamp('created_at').defaultTo(knex.fn.now());
			table.timestamp('updated_at').defaultTo(knex.fn.now());
		});
	}
}).catch(logger.error);
