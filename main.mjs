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

async function getUserPr(repository, username) {
  const queryCurrentProjectPR = `gh api graphql --paginate -f query='
  query ($endCursor: String) {
    repository(owner: "tryber", name: "${repository}") {  
      pullRequests (first: 100, after: $endCursor) {
        edges {
          node {
            baseRefName
            headRefName
            author {
              login
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
  '`;

  const graphQLQueryAnswer = await asyncExec(queryCurrentProjectPR);
  const RegexIteratorOfObjectPR = graphQLQueryAnswer.stdout
    .matchAll(/(?<=\{"node":).*?(?=}[\],])/g);

  const arrayOfObjectPR = [];
  for (const match of RegexIteratorOfObjectPR) {
    arrayOfObjectPR.push(JSON.parse(match[0]));
  }

  const arrayOfUserPRS = arrayOfObjectPR
    .filter((PR) => {
      let isUser = false;
      if (PR.author) {
        const { author: { login } } = PR;
        isUser = login.includes(username);
      }

      const isMergingInMaster = (
        PR.baseRefName === 'master'
        || PR.baseRefName === 'main'
      );

      return isUser && isMergingInMaster;
    });

  const arrayOfBranches = arrayOfUserPRS.map((PR) => PR.headRefName);

  return arrayOfBranches;
}

async function handlePRS(arrayOfUserBranchs) {
  if (arrayOfUserBranchs.length > 1) {
    const { chosenBranch } = await inquirer.prompt(handleMultiplePrsQuestion(arrayOfUserBranchs));
    return chosenBranch;
  }
  if (arrayOfUserBranchs.length === 0) {
    logRedBigBold('Nenhuma branch para esse login encontrado. Você digitou certo?');
    throw new Error('No branch found');
  }
  
  logGreenBigBold('Branch para o projeto encontrada: ', arrayOfUserBranchs[0]);
  return arrayOfUserBranchs[0];
}

async function getBranchFromPR(repository, username) {
  const arrayOfUserBranchs = await getUserPr(repository, username);

  const branchName = handlePRS(arrayOfUserBranchs);

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
