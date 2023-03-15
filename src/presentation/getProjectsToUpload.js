import inquirer from 'inquirer';
import whatProjectsToUploadQuestion
  from './inquirerQuestions/projectHandling/whatProjectsToUpload.mjs';

async function getChoosenProject(projectsFromCurrentTrybe) {
  const { projectsToUpload } = await inquirer
    .prompt(whatProjectsToUploadQuestion(projectsFromCurrentTrybe));

  return projectsToUpload;
}

async function getProjectsToUpload() {
  const projectsToUpload = await getChoosenProject(projectsFromCurrentTrybe);

  return projectsToUpload;
}

export default getProjectsToUpload;
