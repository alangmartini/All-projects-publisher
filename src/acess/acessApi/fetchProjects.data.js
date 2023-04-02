const asyncExecWraper = require('../acessLocal/utils/asyncExec');
const fetchProjectsQuery = require('./queries/fetchProjects.query');
const { ERRORS_OBJECT, ERRORS_TYPE } = require('../errors/object.errors');

async function fetchProjects() {
  try {
    const { stdout, stderr } = await asyncExecWraper.asyncExec(fetchProjectsQuery);
    
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
