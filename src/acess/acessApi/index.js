const { getPullRequests } = require('./getPullRequests.js');
const { getBranchNames } = require('./getBranchName.js');
const { fetchProjects } = require('./fetchProjects.data.js');

module.exports = {
  getPullRequests,
  getBranchNames,
  fetchProjects,
};
