/* eslint-disable max-len */
import inquirer from 'inquirer';
import { logYellowBigBold } from './colorfulLogs/logs.mjs';
// import branchesStardartQuestion from './inquirerQuestions/branchHandling/isBranchesStardartQuestion.mjs';
// import standartBranchNameQuestion from './inquirerQuestions/branchHandling/stardartBranchQuestion.mjs';
import whatProjectsToUploadQuestion from './inquirerQuestions/projectHandling/whatProjectsToUpload.mjs';
import useDefaultNameForProjectsQuestion from './inquirerQuestions/projectNameHandling/useDefaultName.mjs';
import usernameQuestion from './inquirerQuestions/projectNameHandling/usernameQuestion.mjs';
import currentTrybeQuestion from './inquirerQuestions/trybeHandling/currentTrybeQuestion.mjs';
import fetchProjects from './utils/fetchProject.mjs';

// async function getStandartBranchName() {
//   const { areBranchesStandartized } = await inquirer.prompt(branchesStardartQuestion);

//   if (areBranchesStandartized === 'Sim') {
//     const { _standartBranchName } = await inquirer.prompt(standartBranchNameQuestion);
//     return _standartBranchName;
//   }
//   return null;
// }

async function getUsername() {
  const { usernameAnswer } = await inquirer.prompt(usernameQuestion);
  return usernameAnswer;
}

async function getCurrentTrybe() {
  const { currentTrybe } = await inquirer.prompt(currentTrybeQuestion);
  return currentTrybe;
}

async function getUseDefaultProjectName() {
  const { useDefaultNameForProjects } = await inquirer
    .prompt(useDefaultNameForProjectsQuestion);

  return useDefaultNameForProjects;
}

async function getChoosenProject(projectsFromCurrentTrybe) {
  const { projectsToUpload } = await inquirer
    .prompt(whatProjectsToUploadQuestion(projectsFromCurrentTrybe));

  return projectsToUpload;
}

async function getUserInfo() {
  // const standartBranchName = await getStandartBranchName();

  const username = await getUsername();

  const currentTrybe = await getCurrentTrybe();

  const useDefaultNameForProjects = await getUseDefaultProjectName();

  logYellowBigBold(
    'Pegando todos os projetos da sua turma atualmente disponíveis no GitHub',
  );

  const projectsFromCurrentTrybe = await fetchProjects(currentTrybe);

  const projectsToUpload = await getChoosenProject(projectsFromCurrentTrybe);

  return {
    username,
    useDefaultNameForProjects,
    projectsToUpload,
    standartBranchName,
  };
}

export default getUserInfo;
