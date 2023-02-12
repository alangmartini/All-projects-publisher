import { spawn } from 'child_process';
import { logGreenBigBold,
  logRedBigBold, logYellowBigBold } from './colorfulLogs/logs.mjs';
import asyncExec from './utils/asyncExec.mjs';

export async function cloneRepository(repository) {
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

export async function deleteRepository(repository) {
  try {
    logYellowBigBold('DELETANDO REPOSITORIO CLONADO');
    await asyncExec(`rm -rf ${repository}`);
  } catch (e) {
    logRedBigBold('Algo deu errado ao deletar o repositorio:');
    console.log(error.stdout);
  }
}

export async function uploadNewReadme(repository) {
  await asyncExec(`cp NEW_README.md ./${repository}/README.md`);
  const projectName = repository.split('project')[1].toUpperCase().split('-').join(' ');
  await asyncExec(
    `sed -i '42s/project_title/"${projectName}"/' ./${repository}/README.md`,
  );

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
