const { getCurrentFolders } = require('../acessLocal/getCurrentFolder.acess');
const { fetchProjects } = require('./acessApi/fetchProjects.business');
const { removeFolder } = require('./acessLocal/removeFolder.business');
const { validateAndUploadNewReadme } = require('./acessLocal/uploadNewReadme.business');
const { cloneGitRepo } = require('./acessLocal/cloneGitRepo.business');

module.exports = {
  fetchProjects,
  getCurrentFolders,
  removeFolder,
  validateAndUploadNewReadme,
  cloneGitRepo,
};