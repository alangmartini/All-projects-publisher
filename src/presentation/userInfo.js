/* eslint-disable max-len */
import inquirer from 'inquirer';
import useDefaultNameForProjectsQuestion from './inquirerQuestions/projectNameHandling/useDefaultName.mjs';
import usernameQuestion from './inquirerQuestions/projectNameHandling/usernameQuestion.mjs';
import currentTrybeQuestion from './inquirerQuestions/trybeHandling/currentTrybeQuestion.mjs';

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

export default promptUserInfo;
