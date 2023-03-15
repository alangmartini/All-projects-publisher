import asyncExec from '../utils/asyncExec.mjs';
import fetchProjectsQuery from './queries/fetchProjects.query.mjs';

async function fetchProjects() {
  try {
    const { stdout, stderr } = await asyncExec(fetchProjectsQuery);
    console.log(stdout);
    if (stderr) {
      throw new Error();
    }
    console.log(stdout);
    return stdout;
  } catch (e) {
    console.error('Error ao requisitar os projetos atuais do Github da Trybe:', e);
  }
}

await fetchProjects();

export default fetchProjects;
