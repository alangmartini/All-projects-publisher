import inquirer from 'inquirer';
import asyncExec from './src/utils/asyncExec.mjs';

import {
  logGreenBigBold,
  logRedBigBold,
  logYellowBigBold,
} from './src/presentation/colorfulLogs/logs.mjs';

// Question imports
import questionRepositoryNameFromInput 
  from './src/presentation/inquirerQuestions/projectNameHandling/projectNameForRepo.mjs';
import handleMultiplePrsQuestion
  from './src/presentation/inquirerQuestions/branchHandling/handleMultiplePrsQuestion.mjs';

import getUserInfo from './src/presentation/userInfo.mjs';

import {
  cloneRepository,
  deleteRepository,
  uploadNewReadme,
} from './src/manageLocalRepository.mjs';

import {
  decideIfIsGroupProject,
  findAllUserPrsInGroupProject,
} from './src/handleGroupProject.mjs';
import { getBranchNames } from './src/data-acess/getBranchName.mjs';
import getPullRequests from './src/data-acess/getPullRequests.mjs';
import getProjectsToUpload from './src/presentation/getProjectsToUpload.mjs';
import promptUserInfo from './src/presentation/userInfo.mjs';
import fetchProjects from './src/data-acess/fetchProjects.data.mjs';

async function getProjectName(declareNameForProject, userName, repository) {
  // If user decided to declare new project right now
  if (declareNameForProject === 'Agora') {
    // Get new repository name
    const { repoName } = await inquirer.prompt(
      questionRepositoryNameFromInput(repository),
    );
    const formatedRepoName = repoName.split(' ').join('-');
    return formatedRepoName;
  }
  const formatedRepo = repository.split('project');

  return `${userName.split(' ').join('-')}-${formatedRepo}`;
}


function findAllUserPrsNonGroup(arrayOfObjectPR, username) {
  const arrayOfUserPRS = arrayOfObjectPR.filter((PR) => {
    let isUser = false;
    if (PR.node.author) {
      const {
        node: {
          author: { login },
        },
      } = PR;
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
    const { chosenBranch } = await inquirer.prompt(
      handleMultiplePrsQuestion(arrayOfUserBranches),
    );
    return chosenBranch;
  }

  if (arrayOfUserBranches.length === 0) {
    logRedBigBold(
      'Nenhuma branch para esse login encontrado. Você digitou certo?',
    );
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

async function runTrybePublisher(
  branchForCurrentRepository,
  projectName,
  repository,
) {
  try {
    await asyncSpawn(
      'trybe-publisher',
      ['-b', `${branchForCurrentRepository}`, '-p', `${projectName}`],
      repository,
    );
    logGreenBigBold(
      `Finalizado a publicação de ${repository} como ${projectName}`,
    );
  } catch (error) {
    logRedBigBold('Aconteceu algum erro! ');
    console.log(error.stdout);
    logYellowBigBold('Continuando para o próximo repositório');
  }
}

async function run(repository, declareNameForProject, username) {
  const projectName = await getProjectName(
    declareNameForProject,
    username,
    repository,
  );

  logGreenBigBold(`Começando a publicação do projeto: ${repository}`);

  logGreenBigBold(
    'Beleza! Agora começara o processo de clonar o projeto,'
      + ' achar sua branch e renomear o projeto (caso tenha decidido)'
      + ' para subi-lo em seu Github',
  );

  const branchName = await getBranchFromPR(repository, username);

  await runTrybePublisher(branchName, projectName, repository);
}

async function main() {
  // Get necessary info for running the script
  const userInfo = await promptUserInfo();

  const projectsFromCurrentTrybe = await fetchProjects(userInfo.currentTrybe);

  const projectsToUpload = await promptProjectsToUpload(projectsFromCurrentTrybe);

  const { username, useDefaultNameForProjects } = userInfo;

  // Run the script for each project
  for (const project of projectsToUpload) {
    await cloneRepository(project);
    await run(project, useDefaultNameForProjects, username);
    await uploadNewReadme(project);
    await deleteRepository(project);
  }

  logGreenBigBold('Finalizado! Até a próxima');
}

await main();
