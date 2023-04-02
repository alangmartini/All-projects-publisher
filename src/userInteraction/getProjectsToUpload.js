const inquirer = require('inquirer');
const { whatProjectsToUploadQuestion } = require(
  './inquirerQuestions/projectHandling/whatProjectsToUpload',
);

async function getChoosenProject(projectsFromCurrentTrybe) {
  const { projectsToUpload } = await inquirer
    .prompt(whatProjectsToUploadQuestion(projectsFromCurrentTrybe));

  return projectsToUpload;
}

async function promptProjectsToUpload(projectsFromCurrentTrybe) {
  const projectsToUpload = await getChoosenProject(projectsFromCurrentTrybe);

  return projectsToUpload;
}

module.exports = {
  promptProjectsToUpload,
};
