const participantsQuery = require('./queries/participantsQuery');
const { executeCommand } = require('../acessLocal/execs/executeCommand.local');

const handleJSONsString = (JSONstring) => {
  const JSONS = JSONstring.split('{"data":');

  // Remove empty index
  JSONS.shift();

  return JSONS.map((string) => `{"data":${string}`).map((string) => JSON.parse(string));
};

async function tryQuery(repository, tryMergingToMain) {
  const commitsFromBranchString = await executeCommand(
    participantsQuery(repository, tryMergingToMain),
  );

  const separateJSONS = handleJSONsString(commitsFromBranchString.stdout);

  return separateJSONS;
}

async function getPullRequests(repository) {
  // Tries a query that search all PR heading to master
  // Then if none is found, try all heading to main
  let JSONSToWork;
  const separateJSONSMaster = await tryQuery(repository, false);

  const hasResults = separateJSONSMaster[0].data.repository.pullRequests.totalCount > 0;
  if (!hasResults) {
    const separateJSOSMain = await tryQuery(repository, true);
    JSONSToWork = separateJSOSMain;
  } else {
    JSONSToWork = separateJSONSMaster;
  }

  // Get only the PR Object
  const arrayOfPullRequests = JSONSToWork.map(
    (JSON) => JSON.data.repository.pullRequests.edges,
  ).reduce((acc, JSON) => [...acc, ...JSON], []);

  return arrayOfPullRequests;
}

module.exports = {
  getPullRequests,
};
