const { cloneGitRepo } = require('./acessLocal/cloneGitRepo.acess');
const { getCurrentFolders } = require('./acessLocal/getCurrentFolder.acess');
const { removeFolder } = require('./acessLocal/removeFolder.acess');
const uploadNewReadme = require('./acessLocal/uploadNewReadme.access');
const { getPullRequests } = require('./acessApi/getPullRequests');
const { getBranchNames } = require('./acessApi/getBranchName');
const { fetchProjects } = require('./acessApi/fetchProjects.data');

module.exports = {
  getPullRequests,
  getBranchNames,
  fetchProjects,
  getCurrentFolders,
  cloneGitRepo,
  removeFolder,
  uploadNewReadme,
};