/* eslint-disable no-throw-literal */
const { uploadNewReadme } = require('../../acess');

const ERRORS_TYPE = {
  INVALID_REPOSITORY: 'INVALID_REPOSITORY',
};

const ERRORS_OBJECT = {
  INVALID_REPOSITORY: 'Invalid repository name',
};

async function validateAndUploadNewReadme(repository) {
  if (!repository || typeof repository !== 'string' || !repository.startsWith('project')) {
    throw {
      type: ERRORS_TYPE.INVALID_REPOSITORY,
      message: ERRORS_OBJECT.INVALID_REPOSITORY,
      error: new Error(ERRORS_OBJECT.INVALID_REPOSITORY),
    };
  }

  const { copyNewReadme,
    updateReadmeTitle, gitAdd, gitCommit, gitPush } = uploadNewReadme;

  await copyNewReadme(repository);

  const projectName = repository.split('project')[1].toUpperCase().split('-').join(' ');
  await updateReadmeTitle(repository, projectName);

  await gitAdd(repository);
  await gitCommit(repository, 'added new readme');
  await gitPush(repository, 'main');
}

module.exports = {
  validateAndUploadNewReadme,
};