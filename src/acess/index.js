const { cloneGitRepo } = require('./acessLocal/cloneGitRepo.acess');
const { getCurrentFolders } = require('./acessLocal/getCurrentFolder.acess');
const { removeFolder } = require('./acessLocal/removeFolder.acess');
const uploadNewReadme = require('./acessLocal/uploadNewReadme.access');
const { getPullRequests } = require('./acessApi/getPullRequests');
const { getBranchNames } = require('./acessApi/getBranchName');
const { fetchProjects } = require('./acessApi/fetchProjects.data');
const { writeFile } = require('./acessLocal/writeFile.acess');
const { readFile } = require('./acessLocal/readFile.acess');
const { deleteFile } = require('./acessLocal/deleteFile.acess');

module.exports = {
  getPullRequests,
  getBranchNames,
  fetchProjects,
  getCurrentFolders,
  cloneGitRepo,
  removeFolder,
  uploadNewReadme,
  writeFile,
  readFile,
  deleteFile,
};