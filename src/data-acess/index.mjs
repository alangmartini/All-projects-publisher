import getPullRequests from './getPullRequests.mjs';
import getBranchNames from './getBranchName.mjs';
import fetchProjects from './fetchProject.data.mjs';

const dataAcess = {
  getPullRequests,
  getBranchNames,
  fetchProjects,
};

export default dataAcess;
