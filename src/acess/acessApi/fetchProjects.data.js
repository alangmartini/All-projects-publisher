const fetchProjectsQuery = require('./queries/fetchProjects.query');
const { ERRORS_OBJECT, ERRORS_TYPE } = require('../../errors/object.errors');
const { executeCommand } = require('../acessLocal/execs/executeCommand.local');

async function fetchProjects() {
  try {
    const { stdout, stderr } = await executeCommand(fetchProjectsQuery);
    
    if (stderr) {
      throw new Error();
    }

    return stdout;
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
