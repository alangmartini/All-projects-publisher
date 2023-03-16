const asyncExecWraper = require('../utils/asyncExec');
const fetchProjectsQuery = require('./queries/fetchProjects.query');
const errorsObject = require('../errors/object.errors');

async function fetchProjects() {
  try {
    const { stdout, stderr } = await asyncExecWraper.asyncExec(fetchProjectsQuery);
    
    if (stderr) {
      throw new Error();
    }

    return stdout;
  } catch (e) {
    return {
      type: 'BAD_REQUISITION',
      message: errorsObject.BAD_REQUISITION,
      error: e,
    };
  }
}

// Add this to the bottom of your fetchProducts.js file
module.exports = {
  fetchProjects,
};
