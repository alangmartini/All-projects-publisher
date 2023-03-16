import { logGreenBigBold,
  logRedBigBold, logYellowBigBold } from './colorfulLogs/logs.mjs';
const asyncExec = require('./utils/asyncExec.mjs');
const asyncSpawn = require('./utils/asyncSpawn.mjs');

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

  await asyncSpawn('git', ['add', '.'], `./${repository}`);
  await asyncSpawn('git', ['commit', '-am', 'added new readme'], `./${repository}`);
  await asyncSpawn('git', ['push', 'origin', 'main'], `./${repository}`);
}
