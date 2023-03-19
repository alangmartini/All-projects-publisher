const { ERRORS_OBJECT, ERRORS_TYPE } = require('../../errors/object.errors');

const parseJSONStringArr = (graphQLConcatenatedJSONS) => {
  const JSONSArray = graphQLConcatenatedJSONS.split('}}}}}');

  // For some reason split will create an empty index at the end
  const lastIndex = JSONSArray.length - 1;
  if (!JSONSArray[lastIndex]) {
    JSONSArray.pop();
  }

  try {
    let parsedArray = JSONSArray
    .map((json) => `${json}}}}}}`);
    
    parsedArray = parsedArray.map((json) => JSON.parse(json));

    return parsedArray;
  } catch (error) {
    return {
      type: ERRORS_TYPE.FAILED_TO_PARSE,
      message: ERRORS_OBJECT.FAILED_TO_PARSE,
      error,
    };
  }
};

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

module.exports = {
  extractProjectsNamesFromJSON,
  parseJSONStringArr,
};