/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { promisify } from 'util';
import { exec, spawn } from 'child_process';
import inquirer from 'inquirer';
import { logGreenBigBold, logRedBigBold, logYellowBigBold } from './colorfulLogs/logs.mjs';
// Question imports
import branchesStardartQuestion from './inquirerQuestions/branchHandling/isBranchesStardartQuestion.mjs';
import questionBranchNameFromInput from './inquirerQuestions/branchHandling/branchNameUnique.mjs';
import currentTrybeQuestion from './inquirerQuestions/trybeHandling/currentTrybeQuestion.mjs';
import useDefaultNameForProjectsQuestion from './inquirerQuestions/projectNameHandling/useDefaultName.mjs';
import whatProjectsToUploadQuestion from './inquirerQuestions/projectHandling/whatProjectsToUpload.mjs';
import questionRepositoryNameFromInput from './inquirerQuestions/projectNameHandling/projectNameForRepo.mjs';
import standartBranchNameQuestion from './inquirerQuestions/branchHandling/stardartBranchQuestion.mjs';
import userNameForRepoNameQuestion from './inquirerQuestions/projectNameHandling/userNameForRepoNameQuestion.mjs';

const asyncExec = promisify(exec);

const query = `gh api graphql --paginate -f query='
query($endCursor: String) { 
  organization(login: "tryber") { 
    repositories(first: 100, after: $endCursor) {
      nodes { name }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
'`;

async function fetchProjects(triboAtual) {
  let repositories;
  try {
    const { stdout, stderr } = await asyncExec(query);
    // const reg = new RegExp(`sd-0${triboAtual}-[ab]-project.*?(?="},)`, 'g');
    const reg = new RegExp(`sd-0${triboAtual}-[ab].*?(?="},)`, 'g');
    const matchIterator = stdout.matchAll(reg);

    const repositoriesArr = [];
    for (const match of matchIterator) {
      repositoriesArr.push(match[0]);
    }

    repositories = repositoriesArr;

    if (stderr) {
      throw new Error(stderr);
    }
  } catch (err) {
    console.error(err);
  }

  return repositories;
}

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
  await asyncExec(`sed -i '42s/project_title/${projectName}/`);

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
    // To-do: format the name so its '-' split
    const formatedRepoName = repoName.split(' ').join('-');
    return formatedRepoName;
  }
  return `${userName
    .split(' ').join('-')}-${projectRenames[repository].split(' ').join('-')}`;
}

async function runPublisher(
  repository,
  hasStandartBranch,
  declareNameForProject,
  userName,
) {
  const branchForCurrentRepository = await getBranchName(hasStandartBranch, repository);

  const projectName = await getProjectName(declareNameForProject, userName, repository);

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

async function main() {
  const { areBranchesStandartized } = await inquirer.prompt(branchesStardartQuestion);

  let standartBranchName;
  if (areBranchesStandartized === 'Sim') {
    const { _standartBranchName } = await inquirer.prompt(standartBranchNameQuestion);
    standartBranchName = _standartBranchName;
  }

  const { currentTrybe } = await inquirer.prompt(currentTrybeQuestion);

  const { useDefaultNameForProjects } = await inquirer
    .prompt(useDefaultNameForProjectsQuestion);

  let userName;
  if (useDefaultNameForProjects === 'Depois') {
    const { userNameForRepo } = await inquirer.prompt(userNameForRepoNameQuestion);
    userName = userNameForRepo;
  }

  logYellowBigBold('Pegando todos os projetos da sua turma atualmente disponíveis no GitHub');
  const projectsFromCurrentTrybe = await fetchProjects(currentTrybe);

  const { projectsToUpload } = await inquirer
    .prompt(whatProjectsToUploadQuestion(projectsFromCurrentTrybe));

  logGreenBigBold('Beleza! Agora começara o process de clonar o projeto,'
  + 'achar sua branch e renomear o projeto (caso tenha decidido) para subi-lo em seu Github');

  for (const project of projectsToUpload) {
    await cloneRepository(project);
    await runPublisher(project, standartBranchName, useDefaultNameForProjects, userName);
    await uploadNewReadme(project);
    await deleteRepository(project);
  }

  logGreenBigBold('Finalizado! Até a próxima');
}

await main();
