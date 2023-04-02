const { getCurrentFolders } = require('./local/getCurrentFolders.business');
const { fetchProjects } = require('./api/fetchProjects.business');
const { removeFolder } = require('./local/removeFolder.business');
const { validateAndUploadNewReadme } = require('./local/uploadNewReadme.business');
const { cloneGitRepo } = require('./local/cloneGitRepo.business');
const updateTrybePublisher = require('./local/updateTrybePublisher.business');

module.exports = {
  fetchProjects,
  getCurrentFolders,
  removeFolder,
  validateAndUploadNewReadme,
  cloneGitRepo,
  updateTrybePublisher,
};