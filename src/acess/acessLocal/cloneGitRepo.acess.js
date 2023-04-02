const { executeCommand } = require('./execs/executeCommand.local');

const cloneGitRepo = async (repositoryName) => {
  const cloneURL = `git@github.com:tryber/${repositoryName}.git`;

  const result = await executeCommand(`git clone ${cloneURL}`);

  return result;
};

module.exports = {
  cloneGitRepo,
};