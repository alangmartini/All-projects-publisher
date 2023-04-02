const { executeCommand, executeCommandIteractive } = require('./execs/executeCommand.local'); // Import your existing executeCommand and executeCommandIteractive functions

async function copyNewReadme(repository) {
  await executeCommand(`cp NEW_README.md ./${repository}/README.md`);
}

async function updateReadmeTitle(repository, projectName) {
  await executeCommand(
    `sed -i '42s/project_title/"${projectName}"/' ./${repository}/README.md`,
  );
}

async function gitAdd(repository) {
  await executeCommandIteractive('git', ['add', '.'], `./${repository}`);
}

async function gitCommit(repository, message) {
  await executeCommandIteractive('git', ['commit', '-am', message], `./${repository}`);
}

async function gitPush(repository, branch) {
  await executeCommandIteractive('git', ['push', 'origin', branch], `./${repository}`);
}

module.exports = {
  copyNewReadme,
  updateReadmeTitle,
  gitAdd,
  gitCommit,
  gitPush,
};