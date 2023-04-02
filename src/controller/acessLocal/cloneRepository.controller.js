const business = require('../../business-rules');
const { logYellowBigBold, logGreenBigBold } = require('../../userInteraction/colorfulLogs/logs');

async function cloneRepository(repository) {
  const folders = await business.getCurrentFolders();

  const isProjectExistent = folders.match(repository);

  if (isProjectExistent) {
    logGreenBigBold('Encontrado projeto na sua pasta!');
    return;
  }

  logYellowBigBold(`Clonando ${repository}`);
  await business.cloneGitRepo(repository);
}

module.exports = {
  cloneRepository,
};