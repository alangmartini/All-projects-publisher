import { asyncExec } from '../utils/asyncExec.js';
import fetchProjectsQuery from './queries/fetchProjects.query.js';
import errorsObject from '../errors/object.errors.js';

async function fetchProjects() {
  try {
    const { stdout, stderr } = await asyncExec(fetchProjectsQuery);
    console.log('tests', stdout, stderr);
    if (stderr) {
      throw new Error();
    }

    return stdout;
  } catch (e) {
    console.error(errorsObject.BAD_REQUISITION(e));

    return {
      type: 'BAD_REQUISITION',
      message: errorsObject.BAD_REQUISITION(e),
    };
  }
}

// Add this to the bottom of your fetchProducts.js file

export default fetchProjects;
