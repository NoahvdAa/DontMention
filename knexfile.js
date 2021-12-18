const config = require('./config.json');

module.exports = {
	client: 'mysql2',
	connection: config.databaseConnection,
	pool: {
		min: 2,
		max: 10
	},
	migrations: {
		tableName: 'knex_migrations'
	}
};
