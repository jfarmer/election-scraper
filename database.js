let process = require('process');
let Knex = require('knex');
let { attachOnConflictDoNothing } = require('knex-on-conflict-do-nothing');
let dbConfig = require('./knexfile');

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

let knex = Knex(dbConfig[process.env.NODE_ENV]);
attachOnConflictDoNothing();

module.exports = knex;
