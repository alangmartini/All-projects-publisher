const { cloneGitRepo } = require('./cloneGitRepo.acess');
const { getCurrentFolders } = require('./getCurrentFolder.acess');
const { removeFolder } = require('./removeFolder.acess');

module.exports = {
  getCurrentFolders,
  cloneGitRepo,
  removeFolder,
};