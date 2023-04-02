const fetchProjectsQuery = require('./queries/fetchProjects.query');
const { ERRORS_OBJECT, ERRORS_TYPE } = require('../../errors/object.errors');
const { executeCommand } = require('../acessLocal/execs/executeCommand.local');

async function fetchProjects() {
  try {
    const projectsAsGraphQL = await executeCommand(fetchProjectsQuery);
    
    if (!projectsAsGraphQL) {
      throw new Error('No projects found');
    }

    return projectsAsGraphQL;
  } catch (e) {
    return {
      type: ERRORS_TYPE.BAD_REQUISITION,
      message: ERRORS_OBJECT.BAD_REQUISITION,
      error: e,
    };
  }
}

module.exports = {
  fetchProjects,
};
