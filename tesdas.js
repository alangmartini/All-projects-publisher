const fs = require('fs');

const accessContent = `const { executeCommand, executeCommandIteractive } = require('./yourCommandsFile'); // Import your existing executeCommand and executeCommandIteractive functions

async function copyNewReadme(repository) {
  await executeCommand(\`cp NEW_README.md ./\${repository}/README.md\`);
}

async function updateReadmeTitle(repository, projectName) {
  await executeCommand(
    \`sed -i '42s/project_title/"\${projectName}"/' ./\${repository}/README.md\`,
  );
}

async function gitAdd(repository) {
  await executeCommandIteractive('git', ['add', '.'], \`./\${repository}\`);
}

async function gitCommit(repository, message) {
  await executeCommandIteractive('git', ['commit', '-am', message], \`./\${repository}\`);
}

async function gitPush(repository, branch) {
  await executeCommandIteractive('git', ['push', 'origin', branch], \`./\${repository}\`);
}

module.exports = {
  copyNewReadme,
  updateReadmeTitle,
  gitAdd,
  gitCommit,
  gitPush,
};`;

const businessContent = `const { copyNewReadme, updateReadmeTitle, gitAdd, gitCommit, gitPush } = require('./uploadNewReadme.access');

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

  await copyNewReadme(repository);

  const projectName = repository.split('project')[1].toUpperCase().split('-').join(' ');
  await updateReadmeTitle(repository, projectName);

  await gitAdd(repository);
  await gitCommit(repository, 'added new readme');
  await gitPush(repository, 'main');
}

module.exports = {
  validateAndUploadNewReadme,
  ERRORS_TYPE,
  ERRORS_OBJECT,
};`;

const controllerContent = `const { validateAndUploadNewReadme } = require('./uploadNewReadme.business');

async function uploadNewReadmeController(repository) {
  try {
    await validateAndUploadNewReadme(repository);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  uploadNewReadmeController,
};`;

fs.writeFileSync('uploadNewReadme.access.js', accessContent);
fs.writeFileSync('uploadNewReadme.business.js', businessContent);
fs.writeFileSync('uploadNewReadme.controller.js', controllerContent);

console.log('Files created successfully!');
