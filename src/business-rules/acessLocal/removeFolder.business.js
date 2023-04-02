const acessLocal = require('../../acessLocal');
const { ERRORS_TYPE, ERRORS_OBJECT } = require('../../errors/object.errors');

const removeFolder = async (folder) => {
  const result = await acessLocal.removeFolder(folder);

  if (result instanceof Error) {
    return { 
      type: ERRORS_TYPE.FAILED_TO_EXEC_COMMAND,
      message: ERRORS_OBJECT.FAILED_TO_EXEC_COMMAND,
      error: result,
    };
  }

  return false;
};

module.exports = {
  removeFolder,
};