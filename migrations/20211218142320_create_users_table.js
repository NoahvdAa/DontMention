exports.up = function (knex) {
	return knex.schema.createTable('users', (table) => {
		table.string('id', 18).unique();
		table.boolean('preference');
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable('users');
};
