let process = require('process');
let NYTimesAPI = require('./NYTimesAPI');
let knex = require('./database');

function log(...args) {
  let now = new Date();

  console.log(`[${now.toISOString()}]`, ...args);
}

// Every second, pull in data for given states
async function processStates(knex, states, pollingInterval) {
  try {
    for (let stateName of states) {
      log(`Fetching data for: ${stateName}`);
      await NYTimesAPI.insertStateData(knex, stateName);
    }
  } catch (e) {
    console.error('Error!');
  }

  log(`Fetching again in ${pollingInterval / 1000} seconds`);

  setTimeout(async() => {
    processStates(knex, states);
  }, pollingInterval);
}

let userArgs = process.argv.slice(2);
if (userArgs.length < 1) {
  console.error('Error: missing required state name(s)');
  process.exit(1);
}

let pollingInterval = 60 * 1000;
processStates(knex, userArgs, pollingInterval);
