/* eslint-disable max-lines-per-function */
const inquirer = require('inquirer');
const cliProgress = require('cli-progress');
const controller = require('./src/controller');

const {
  logGreenBigBold,
  logRedBigBold,
  logYellowBigBold,
} = require('./src/userInteraction/colorfulLogs/logs');

const { questionRepositoryNameFromInput } = require(
  './src/userInteraction/inquirerQuestions/projectNameHandling/projectNameForRepo',
  );
const { handleMultiplePrsQuestion } = require(
  './src/userInteraction/inquirerQuestions/branchHandling/handleMultiplePrsQuestion',
);

const {
  decideIfIsGroupProject,
  findAllUserPrsInGroupProject,
} = require('./src/handleGroupProject');
const { getBranchNames } = require('./src/acess');
const { getPullRequests } = require('./src/acess');
const { promptUserInfo } = require('./src/userInteraction/userInfo');
const { fetchProjects } = require('./src/business-rules');
const { promptProjectsToUpload } = require('./src/userInteraction/getProjectsToUpload');
const { executeCommandIteractive } = require('./src/acess/acessLocal/execs/executeCommand.local');

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

async function executeTrybePublisher(
  branchForCurrentRepository,
  projectName,
  repository,
) {
  try {
    const command = `trybe-publisher -b ${branchForCurrentRepository} -p ${projectName}`;
    await executeCommandIteractive(command, repository);
  } catch (error) {
    logRedBigBold('Aconteceu algum erro! ');
    console.log(error.stdout);
    logYellowBigBold('Continuando para o próximo repositório');
  }
}

async function handleProjects(project, declareNameForProject, username) {
  const projectName = await getProjectName(
    declareNameForProject,
    username,
    project,
  );

  const branchName = await getBranchFromPR(project, username);

  return { branchName, projectName, project };
}

async function publishProject(project, declareNameForProject, username) {  
  const { branchName, projectName } = await handleProjects(
    project,
    declareNameForProject,
    username,
  );

  await executeTrybePublisher(branchName, projectName, project);

  logGreenBigBold(
    `Finalizado a publicação de ${project} como ${projectName}`,
  );
}

async function run(project, useDefaultNameForProjects, username, multiBar) {
  const progressBar = multiBar.create(100, 0, {
    task: `${project.split(/-[ab]-/)[1].replace('project', '').replace('-', ' ')}`,
  });

  progressBar.update(25, { step: 'Clonando repositório' });
  await controller.cloneRepository(project);

  progressBar.update(50, { step: 'Publicando repositório' });
  await publishProject(project, useDefaultNameForProjects, username);

  progressBar.update(75, { step: 'Atualizando README' });
  await controller.uploadNewReadme(project);

  progressBar.update(90, { step: 'Deletando repositório local' });
  await controller.deleteRepository(project);

  progressBar.update(100);
  progressBar.stop();
}

async function main() {
  // Get necessary info for running the script
  console.log('im here');
  const userInfo = await promptUserInfo();

  logYellowBigBold(
    'Pegando todos os projetos da sua turma atualmente disponíveis no GitHub',
  );
  
  const projectsFromCurrentTrybe = await fetchProjects(userInfo.currentTrybe); // tested

  const projectsToUpload = await promptProjectsToUpload(projectsFromCurrentTrybe);

  const { username, useDefaultNameForProjects } = userInfo;

  logGreenBigBold(
    `Beleza! Agora começara o processo de clonar os projetos,`
      + ' achar sua branch em cada e renomear o projeto (caso tenha decidido)'
      + ' para subi-lo em seu Github',
  );

  const multiBar = new cliProgress.MultiBar({
    format: '{task} | {bar} {percentage}% | {value}/{total} | {step}',
    clearOnComplete: false,
    hideCursor: true,
  });

  const tasks = projectsToUpload
    .map((project) => run(project, useDefaultNameForProjects, username, multiBar));

  // Run the script for each project
  await Promise.all(tasks);

  multiBar.stop();

  logGreenBigBold('Finalizado! Até a próxima');
}

(async function teste() { await main(); })();