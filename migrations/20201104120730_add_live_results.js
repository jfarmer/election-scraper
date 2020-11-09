exports.up = function(knex) {
  return knex.schema.createTable('live_results', (table) => {
    table.increments('id').primary();
    table.text('state').notNullable();
    table.timestamp('last_updated').notNullable();
    table.integer('precincts_reporting').notNullable();
    table.integer('precincts_total').notNullable();
    table.integer('trump_votes').notNullable();
    table.integer('biden_votes').notNullable();
    table.unique(['state', 'last_updated']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('live_results');
};
