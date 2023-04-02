const localHandling = require('../../acessLocal');
const { ERRORS_OBJECT, ERRORS_TYPE } = require('../../errors/object.errors');

const getCurrentFolders = async () => {
  const folders = await localHandling.getCurrentFolders();

  if (folders instanceof Error) {
    return {
      type: ERRORS_TYPE.FAILED_TO_EXEC_COMMAND,
      message: ERRORS_OBJECT.FAILED_TO_EXEC_COMMAND,
      error: folders,
    };
  }

  if (!folders) {
    return {
      type: ERRORS_TYPE.NO_FOLDER_FOUND,
      message: ERRORS_OBJECT.NO_FOLDER_FOUND,
      error: new Error(ERRORS_OBJECT.NO_FOLDER_FOUND),
    };
  }

  return folders;
};

module.exports = {
  getCurrentFolders,
};