import dataAcess from '../data-acess';

async function fetchProjectsLeg(triboAtual) {
  logYellowBigBold(
    'Pegando todos os projetos da sua turma atualmente disponíveis no GitHub',
  );

  let repositories;
  try {
    const { stdout, stderr } = dataAcess.fetchProjects();

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

export default fetchProjects;
