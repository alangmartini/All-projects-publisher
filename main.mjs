/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
import { spawn } from 'child_process';
import inquirer from 'inquirer';
import { logGreenBigBold, logRedBigBold, logYellowBigBold } from './src/colorfulLogs/logs.mjs';

// Question imports
import questionRepositoryNameFromInput from './src/inquirerQuestions/projectNameHandling/projectNameForRepo.mjs';
import handleMultiplePrsQuestion from './src/inquirerQuestions/branchHandling/handleMultiplePrsQuestion.mjs';
import getUserInfo from './src/userInfo.mjs';
import { cloneRepository, deleteRepository, uploadNewReadme } from './src/manageLocalRepository.mjs';
import asyncExec from './src/utils/asyncExec.mjs';
import pullRequestQuery from './src/queries/pullRequestQuery.mjs';
import participantsQuery from './src/queries/participantsQuery.mjs';
import { findAllUserPrsInGroupProject, getPullRequests } from './src/handleGroupProject.mjs';

async function getProjectName(declareNameForProject, userName, repository) {
  // If user decided to declare new project right now
  if (declareNameForProject === 'Agora') {
    // Get new repository name
    const { repoName } = await inquirer
      .prompt(questionRepositoryNameFromInput(repository));
    const formatedRepoName = repoName.split(' ').join('-');
    return formatedRepoName;
  }
  const formatedRepo = repository.split('project');

  return `${userName
    .split(' ').join('-')}-${formatedRepo}`;
}

function getBranchNames(arrayOfObjectPR) {
  const allBranchesNames = arrayOfObjectPR.map(({ node }) => node.headRefName);
  return allBranchesNames;
}

function decideIfIsGroupProject(arrayOfObjectPR) {
  // This function is for soft checking if repository is for
  // a group project.
  // To-do: find a more foolproof way.
  const allBranchesNames = getBranchNames(arrayOfObjectPR);
  const thresholdForIsGroup = 0.1;
  const amountOfMainGroups = allBranchesNames.filter((name) => (
    name.includes('main')
    || name.includes('group')
    || name.includes('main-group')
    || name.includes('master-group')
  )).length;

  const isGroupProject = (amountOfMainGroups / allBranchesNames.length) >= thresholdForIsGroup;

  return isGroupProject;
}

function findAllUserPrsNonGroup(arrayOfObjectPR, username) {
  const arrayOfUserPRS = arrayOfObjectPR
    .filter((PR) => {
      let isUser = false;
      if (PR.node.author) {
        const { node: { author: { login } } } = PR;
        isUser = login.includes(username);
      }

      return isUser;
    });

  return arrayOfUserPRS;
}

async function getUserPr(repository, username) {
  const arrayOfObjectPR = await getPullRequests(repository);

  const isGroupProject = decideIfIsGroupProject(arrayOfObjectPR);

  let arrayOfUserPRS;
  if (isGroupProject) {
    arrayOfUserPRS = findAllUserPrsInGroupProject(arrayOfObjectPR, username);
  } else {
    arrayOfUserPRS = findAllUserPrsNonGroup(arrayOfObjectPR, username);
  }

  const arrayOfUserBranches = getBranchNames(arrayOfUserPRS);

  return arrayOfUserBranches;
}

async function handleBranches(arrayOfUserBranches) {
  if (arrayOfUserBranches.length > 1) {
    const { chosenBranch } = await inquirer.prompt(handleMultiplePrsQuestion(arrayOfUserBranches));
    return chosenBranch;
  }

  if (arrayOfUserBranches.length === 0) {
    logRedBigBold('Nenhuma branch para esse login encontrado. Você digitou certo?');
    throw new Error('No branch found');
  }

  return arrayOfUserBranches[0];
}

async function getBranchFromPR(repository, username) {
  const arrayOfUserBranchs = await getUserPr(repository, username);

  let branchName = await handleBranches(arrayOfUserBranchs);

  const matchGroupBranch = branchName.match(/main-group-\d+/);
  if (matchGroupBranch) {
    [branchName] = matchGroupBranch;
  }

  logGreenBigBold(`Branch para o projeto encontrada: ${branchName}`);
  return branchName;
}

async function runTrybePublisher(branchForCurrentRepository, projectName, repository) {
  const asyncSpawn = async () => new Promise((resolve, reject) => {
    const publisherProcess = spawn(
      'trybe-publisher',
      ['-b', `${branchForCurrentRepository}`, '-p', `${projectName}`],
      {
        cwd: repository,
        stdio: 'inherit',
      },
    );

    publisherProcess.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`trybe publisher exit with error ${code}`));
      }
    });
  });

  try {
    await asyncSpawn();
    logGreenBigBold(`Finalizado a publicação de ${repository} como ${projectName}`);
  } catch (error) {
    logRedBigBold('Aconteceu algum erro! ');
    console.log(error.stdout);
    logYellowBigBold('Continuando para o próximo repositório');
  }
}

async function run(
  repository,
  hasStandartBranch,
  declareNameForProject,
  username,
) {
  // const branchForCurrentRepository = await getBranchName(hasStandartBranch, repository);

  const projectName = await getProjectName(declareNameForProject, username, repository);

  logGreenBigBold(`Começando a publicação do projeto: ${repository}`);

  logGreenBigBold('Beleza! Agora começara o processo de clonar o projeto,'
  + ' achar sua branch e renomear o projeto (caso tenha decidido)'
  + ' para subi-lo em seu Github');

  const branchName = await getBranchFromPR(repository, username);

  await runTrybePublisher(branchName, projectName, repository);
}

async function main() {
  // Get necessary info for running the script
  const userInfo = await getUserInfo();
  const { username, useDefaultNameForProjects, projectsToUpload,
    standartBranchName } = userInfo;

  // Run the script for each project
  for (const project of projectsToUpload) {
    await cloneRepository(project);
    await run(project, standartBranchName, useDefaultNameForProjects, username);
    await uploadNewReadme(project);
    await deleteRepository(project);
  }

  logGreenBigBold('Finalizado! Até a próxima');
}

await main();
