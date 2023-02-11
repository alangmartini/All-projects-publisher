/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { promisify } from 'util';
import { exec, spawn } from 'child_process';
import inquirer from 'inquirer';
import { logGreenBigBold, logRedBigBold, logYellowBigBold } from './colorfulLogs/logs.njs';
// Question imports
import branchesStardartQuestion from './inquirerQuestions/branchHandling/isBranchesStardartQuestion.mjs';
import questionBranchNameFromInput from './inquirerQuestions/branchHandling/branchNameUnique.mjs';
import currentTrybeQuestion from './inquirerQuestions/trybeHandling/currentTrybeQuestion.mjs';
import useDefaultNameForProjectsQuestion from './inquirerQuestions/projectNameHandling/useDefaultName.mjs';
import whatProjectsToUploadQuestion from './inquirerQuestions/projectHandling/whatProjectsToUpload.mjs';
import questionRepositoryNameFromInput from './inquirerQuestions/projectNameHandling/projectNameForRepo.mjs';
import projectRenames from './renames/projectRenaming.mjs';
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

async function runPublisher(
  repository,
  hasStandartBranch,
  declareNameForProject,
  userName,
) {
  // If there is no standartBranchName, get one from input.
  let branchForCurrentRepository;
  if (!hasStandartBranch) {
    // Get current project branchName from input
    const { branchNameFromInput } = await inquirer
      .prompt(questionBranchNameFromInput(repository));
    branchForCurrentRepository = branchNameFromInput;
  } else {
    branchForCurrentRepository = hasStandartBranch;
  }

  let projectName;
  if (declareNameForProject === 'Agora') {
    // Get new repository name
    const { repoName } = await inquirer
      .prompt(questionRepositoryNameFromInput(repository));
    // To-do: format the name so its '-' split
    projectName = repoName;
  } else {
    projectName = `${userName
      .split(' ').join('-')}-${projectRenames[repository].split(' ').join('-')}`;
  }

  const asyncSpawn = async () => new Promise((resolve, reject) => {
    console.log(repository);
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
    console.log(`Finished publishing ${repository} as ${projectName}`);
  } catch (e) {
    console.log('Aconteceu algum erro! ');
    console.log(e.error);
  }
}

async function main() {
  const { areBranchesStandartized } = await inquirer.prompt(branchesStardartQuestion);
  console.log(areBranchesStandartized);

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

  console.log('Pegando todos os projetos da sua turma atualmente disponíveis no GitHub');
  const projectsFromCurrentTrybe = await fetchProjects(currentTrybe);

  const { projectsToUpload } = await inquirer
    .prompt(whatProjectsToUploadQuestion(projectsFromCurrentTrybe));

  console.log(`Beleza! Agora começara o process de clonar o projeto, 
  achar sua branch e renomear o projeto (caso tenha decido) para subi-lo em seu Github`);

  for (const project of projectsToUpload) {
    await cloneRepository(project);
    await runPublisher(project, standartBranchName, useDefaultNameForProjects, userName);
    await deleteRepository(project);
  }
}

await main();
