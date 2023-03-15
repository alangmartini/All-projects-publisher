import asyncExec from '../utils/asyncExec.mjs';
import fetchProjectsQuery from './queries/fetchProjects.query.mjs';

async function fetchProjects() {
  try {
    const { stdout, stderr } = await asyncExec(fetchProjectsQuery);

    if (stderr) {
      throw new Error();
    }

    return stdout;
  } catch (e) {
    console.error('Error ao requisitar os projetos atuais do Github da Trybe:', e);

    return {
      type: 'BAD_REQUISITION',
      message: `Error ao requisitar os projetos atuais do Github da Trybe: ${e}`,
    };
  }
}

export default fetchProjects;
