const dataAcess = require('../../acess');
const { ERRORS_OBJECT, ERRORS_TYPE } = require('../../errors/object.errors');
const utils = require('./utils.fetchProjects');

async function fetchProjects(triboAtual) {
  const possibleGraphQLStringWithProjects = await dataAcess.fetchProjects();

  if (possibleGraphQLStringWithProjects.type) {
    const error = possibleGraphQLStringWithProjects;
    return error;
  }

  const graphQLConcatenatedJSONS = possibleGraphQLStringWithProjects;

  const parsedJSONSArray = utils.parseJSONStringArr(graphQLConcatenatedJSONS);

  const projectNamesArray = utils.extractProjectsNamesFromJSON(triboAtual, parsedJSONSArray);

  if (projectNamesArray.length === 0) {
    return { 
      type: ERRORS_TYPE.NO_PROJECT_FOUND,
      message: ERRORS_OBJECT.NO_PROJECT_FOUND,
      error: new Error(ERRORS_OBJECT.NO_PROJECT_FOUND),
    };
  }

  return projectNamesArray;
}

(async () => { await fetchProjects(26); })();

module.exports = {
  // Funcs exported for testing
  fetchProjects,
};

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
