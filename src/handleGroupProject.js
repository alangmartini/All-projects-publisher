/* eslint-disable no-await-in-loop */
/* eslint-disable react-func/max-lines-per-function */
const getBranchNames = require('./data-acess/getBranchName.mjs');

export function decideIfIsGroupProject(arrayOfObjectPR) {
  // This function is for soft checking if repository is for
  // a group project.
  // To-do: find a more foolproof way.
  const allBranchesNames = getBranchNames(arrayOfObjectPR);
  const thresholdForIsGroup = 0.1;
  const amountOfMainGroups = allBranchesNames.filter((name) => (
    name.includes('main')
    || name.includes('group')
    || name.includes('main-group')
    || name.includes('master-group')
  )).length;

  const isGroupProject = (amountOfMainGroups / allBranchesNames.length)
    >= thresholdForIsGroup;

  return isGroupProject;
}

export function findAllUserPrsInGroupProject(arrayOfObjectPR, user) {
  // Filter the PullRequest where the user is a participant
  const pullRequestFromUser = arrayOfObjectPR.filter((pullRequestObj) => {
    const prParticipants = pullRequestObj.node.participants.nodes;
    const isParticipant = prParticipants.some(({ login }) => login === user);
    return isParticipant;
  });

  return pullRequestFromUser;
}
