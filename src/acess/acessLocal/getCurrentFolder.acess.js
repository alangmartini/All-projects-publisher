const { executeCommand } = require('./execs/executeCommand.local');

const getCurrentFolders = async () => {
  const folders = await executeCommand('ls');

  return folders;
};

module.exports = {
  getCurrentFolders,
};