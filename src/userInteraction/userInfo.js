/* eslint-disable max-len */
const inquirer = require('inquirer');
const { useDefaultNameForProjectsQuestion } = require('./inquirerQuestions/projectNameHandling/useDefaultName');
const { usernameQuestion } = require('./inquirerQuestions/projectNameHandling/usernameQuestion');
const { currentTrybeQuestion } = require('./inquirerQuestions/trybeHandling/currentTrybeQuestion');

async function promptUsername() {
  const { usernameAnswer } = await inquirer.prompt(usernameQuestion);
  return usernameAnswer;
}

async function promptCurrentTrybe() {
  const { currentTrybe } = await inquirer.prompt(currentTrybeQuestion);
  return currentTrybe;
}

async function promptUseDefaultProjectName() {
  const { useDefaultNameForProjects } = await inquirer
    .prompt(useDefaultNameForProjectsQuestion);

  return useDefaultNameForProjects;
}

async function promptUserInfo() {
  const username = await promptUsername();

  const currentTrybe = await promptCurrentTrybe();

  const useDefaultNameForProjects = await promptUseDefaultProjectName();

  return {
    username,
    currentTrybe,
    useDefaultNameForProjects,
  };
}

module.exports = { promptUserInfo };
