import dataAcess from '../data-acess/index.mjs';
import errorsObject from '../errors/object.errors.mjs';
import { logYellowBigBold } from '../presentation/colorfulLogs/logs.mjs';

const extractProjectsNamesFromJSON = (triboAtual, JSONSArray) => {
  const repositoriesArray = JSONSArray.reduce((acc, JSON) => {
    const projectsObjs = JSON.data.organization.repositories.nodes;

    projectsObjs.forEach(({ name }) => {
      const turmaRegex = new RegExp(`sd-0${triboAtual}`);

      if (turmaRegex.test(name)) {
        acc.push(name);
      }
    });

    return acc;
  }, []);

  return repositoriesArray;
};

async function fetchProjects(triboAtual) {
  logYellowBigBold(
    'Pegando todos os projetos da sua turma atualmente disponíveis no GitHub',
  );

  const possibleGraphQLStringWithProjects = await dataAcess.fetchProjects();

  if (possibleGraphQLStringWithProjects.type) {
    const error = possibleGraphQLStringWithProjects;
    return error;
  }

  const graphQLConcatenatedJSONS = possibleGraphQLStringWithProjects;

  let JSONSArray = graphQLConcatenatedJSONS.split('}}}}}');

  // For some reason split will create an empty index at the end
  const lastIndex = JSONSArray.length - 1;
  if (!JSONSArray[lastIndex]) {
    JSONSArray.pop();
  }

  try {
    JSONSArray = JSONSArray
      .map((json) => `${json}}}}}}`)
      .map((json) => JSON.parse(json));
  } catch (error) {
    return {
      type: 'FAILED_TO_PARSE',
      message: errorsObject.FAILED_TO_PARSE };
  }

  const repositoriesArr = extractProjectsNamesFromJSON(triboAtual, JSONSArray);

  return repositoriesArr;
}

export default fetchProjects;

// Legacy fetch projects uses Regex. Not very reliable
// async function fetchProjectsLeg(triboAtual) {
//   logYellowBigBold(
//     'Pegando todos os projetos da sua turma atualmente disponíveis no GitHub',
//   );

//   let repositories;
//   try {
//     const { stdout, stderr } = dataAcess.fetchProjects();

//     const reg = new RegExp(`sd-0${triboAtual}-[ab].*?(?="},)`, 'g');
//     const matchIterator = stdout.matchAll(reg);

//     const repositoriesArr = [];
//     for (const match of matchIterator) {
//       repositoriesArr.push(match[0]);
//     }

//     repositories = repositoriesArr;

//     if (stderr) {
//       throw new Error(stderr);
//     }
//   } catch (err) {
//     console.error(err);
//   }

//   return repositories;
// }
