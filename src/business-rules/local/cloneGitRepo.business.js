const acessLocal = require('../../acess');
const { ERRORS_TYPE, ERRORS_OBJECT } = require('../../errors/object.errors');

const cloneGitRepo = async (repositoryName) => {
  const result = acessLocal.cloneGitRepo(repositoryName);

  if (result instanceof Error) {
    return {
      type: ERRORS_TYPE.FAILED_TO_CLONE,
      message: ERRORS_OBJECT.FAILED_TO_CLONE,
      error: result,
    };
  }

  const currentFolders = await acessLocal.getCurrentFolders();

  if (!currentFolders.includes(repositoryName)) {
    return {
      type: ERRORS_TYPE.WRONG_CLONING,
      message: ERRORS_TYPE.WRONG_CLONING,
      error: new Error('Recently cloned repository not found in folders.'),
    };
  }

  return true;
};

module.exports = {
  cloneGitRepo,
};