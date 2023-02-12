/* eslint-disable max-lines */
/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { promisify } from 'util';
import { exec, spawn } from 'child_process';
import inquirer from 'inquirer';
import { logGreenBigBold, logRedBigBold, logYellowBigBold } from './src/colorfulLogs/logs.mjs';
// Question imports
import questionBranchNameFromInput from './src/inquirerQuestions/branchHandling/branchNameUnique.mjs';
import questionRepositoryNameFromInput from './src/inquirerQuestions/projectNameHandling/projectNameForRepo.mjs';
import handleMultiplePrsQuestion from './src/inquirerQuestions/branchHandling/handleMultiplePrsQuestion.mjs';
import getUserInfo from './src/userInfo.mjs';

const asyncExec = promisify(exec);

async function cloneRepository(repository) {
  const { stdout } = await asyncExec('ls');
  const isProjectExistent = stdout.match(repository);

  if (isProjectExistent) {
    logGreenBigBold('Encontrado projeto na sua pasta!');
  } else {
    logYellowBigBold(`Clonando ${repository}`);
    const cloneURL = `git@github.com:tryber/${repository}.git`;
    await asyncExec(`git clone ${cloneURL}`);
  }
}

async function deleteRepository(repository) {
  try {
    logYellowBigBold('DELETANDO REPOSITORIO CLONADO');
    await asyncExec(`rm -rf ${repository}`);
  } catch (e) {
    logRedBigBold('Algo deu errado ao deletar o repositorio:');
    console.log(error.stdout);
  }
}

async function getBranchName(hasStandartBranch, repository) {
  if (!hasStandartBranch) {
    // Get current project branchName from input
    const { branchNameFromInput } = await inquirer
      .prompt(questionBranchNameFromInput(repository));
    return branchNameFromInput;
  }
  return hasStandartBranch;
}

async function uploadNewReadme(repository) {
  await asyncExec(`cp NEW_README.md ./${repository}/README.md`);
  const projectName = repository.split('project')[1].toUpperCase().split('-').join(' ');
  await asyncExec(`sed -i '42s/project_title/"${projectName}"/' ./${repository}/README.md`);

  const asyncGitSpawn = async (commandArray) => new Promise((resolve, reject) => {
    const publisherProcess = spawn(
      'git',
      commandArray,
      {
        cwd: repository,
        stdio: 'inherit',
      },
    );

    publisherProcess.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`git exit with error ${code}`));
      }
    });
  });

  await asyncGitSpawn(['add', '.']);
  await asyncGitSpawn(['commit', '-am', 'added new readme']);
  await asyncGitSpawn(['push', 'origin', 'main']);
}

async function getProjectName(declareNameForProject, userName, repository) {
  // If user decided to declare new project right now
  if (declareNameForProject === 'Agora') {
    // Get new repository name
    const { repoName } = await inquirer
      .prompt(questionRepositoryNameFromInput(repository));
    const formatedRepoName = repoName.split(' ').join('-');
    return formatedRepoName;
  }
  return `${userName
    .split(' ').join('-')}-${projectRenames[repository].split(' ').join('-')}`;
}

async function getUserPr(repository, username) {
  const queryCurrentProjectPR = `gh api graphql --paginate -f query='
  query ($endCursor: String) {
    repository(owner: "tryber", name: ${repository}) {  
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
    .filter((PR) => PR.author.login.includes(username)
      && (
        PR.baseRefName === 'master'
        || PR.baseRefName === 'main'
      ));

  return arrayOfUserPRS;
}

async function handlePRS(arrayOfUserPrs) {
  if (arrayOfUserPrs.length > 1) {
    const { chosenBranch } = await inquirer(handleMultiplePrsQuestion(arrayOfUserPrs));
    return chosenBranch;
  }
  return arrayOfUserPrs[0];
}

async function getBranchFromPR(repository, username) {
  const arrayOfUserPrs = await getUserPr(repository, username);

  const branchName = handlePRS(arrayOfUserPrs);

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

  const projectName = await getProjectName(declareNameForProject, userName, repository);

  const branchName = await getBranchFromPR(repository, username);

  await runTrybePublisher(branchName, projectName, repository);
}

async function main() {
  // Get necessary info for running the script

  const userInfo = await getUserInfo();
  const { username, useDefaultNameForProjects, projectsToUpload, standartBranchName } = userInfo;

  logGreenBigBold('Beleza! Agora começara o processo de clonar o projeto,'
  + ' achar sua branch e renomear o projeto (caso tenha decidido) para subi-lo em seu Github');

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
