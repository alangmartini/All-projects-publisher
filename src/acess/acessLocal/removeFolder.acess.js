const { executeCommand } = require('./execs/executeCommand.local');

const removeFolder = async (folder) => {
  const result = await executeCommand(`rm -rf ${folder}`);

  return result;
};

module.exports = {
  removeFolder,
};