let fetch = require('node-fetch');

let TRUMP_CANDIDATE_KEY = 'trumpd';
let BIDEN_CANDIDATE_KEY = 'bidenj';

function getNYTimesURL(stateName) {
  return `https://static01.nyt.com/elections-assets/2020/data/api/2020-11-03/state-page/${stateName}.json`;
}

async function fetchNYTimesData(stateName) {
  let response = await fetch(getNYTimesURL(stateName));
  let apiResponse = await response.json();

  return apiResponse.data;
}

function getPresidentialRaceByState(races, stateName) {
  return races.find(race => race.state_slug === stateName && race.race_type === 'president');
}

function getCandidateDataByRace(race, candidateKey) {
  return race.candidates.find(candidate => candidate.candidate_key === candidateKey);
}

async function getCandidateDataByState(stateName) {
  let nytimesData = await fetchNYTimesData(stateName);

  let presidentialRace = getPresidentialRaceByState(nytimesData.races, stateName);
  let trump = getCandidateDataByRace(presidentialRace, TRUMP_CANDIDATE_KEY);
  let biden = getCandidateDataByRace(presidentialRace, BIDEN_CANDIDATE_KEY);

  return {
    state: stateName,
    last_updated: presidentialRace.last_updated,
    precincts_reporting: presidentialRace.precincts_reporting,
    precincts_total: presidentialRace.precincts_total,
    trump_votes: trump.votes,
    biden_votes: biden.votes,
  };
}

async function insertStateData(db, stateName) {
  let insertData = await getCandidateDataByState(stateName);

  await db('live_results').insert(insertData).onConflictDoNothing();
}

module.exports = {
  getNYTimesURL,
  fetchNYTimesData,
  getPresidentialRaceByState,
  getCandidateDataByRace,
  getCandidateDataByState,
  insertStateData,
};
