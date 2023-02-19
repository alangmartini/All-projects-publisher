/* eslint-disable no-await-in-loop */
/* eslint-disable react-func/max-lines-per-function */
import asyncExec from './utils/asyncExec.mjs';
import applyRegexAndParse from './utils/applyRegexAndParse.mjs';
import participantsQuery from './queries/participantsQuery.mjs';

async function getCommitInfo(repository, branchName) {
  const query = `
  query ($endCursor: String) {
    repository(owner: "tryber", name: "${repository}") {
      ref(qualifiedName: "${branchName}") {
        name
        target {
          ... on Commit {
            history(first: 100, after: $endCursor) {
              nodes {
                author {
                  user {
                    login
                  }
                }
              }
            pageInfo {
              hasNextPage
              endCursor
              }
            }
          }
        }
      }
    }
  }
  `;

  const commitsFromBranchString = await asyncExec(
    `gh api graphql --paginate -f query='${query}'`,
  );

  return commitsFromBranchString.stdout;
}

export async function getPullRequestsLeg(repository) {
  let endCursor = null;
  const arrayOfPullRequests = [];
  let isMain = false;

  while (true) {
    const commitsFromBranchString = await asyncExec(
      participantsQuery(repository, false, endCursor),
    );

    const data = JSON.parse(commitsFromBranchString.stdout);

    if (data.data.repository.pullRequests.totalCount !== 0) {
      arrayOfPullRequests.push(data.data.repository.pullRequests);
      // Process the data here

      if (!data.data.repository.pullRequests.pageInfo.hasNextPage) {
        break;
      }

      endCursor = data.data.repository.pullRequests.pageInfo.endCursor;
    } else {
      isMain = true;
    }
  }

  return arrayOfPullRequests;
}

const handleJSONsString = (JSONstring) => {
  const JSONS = JSONstring.split('{"data":');
  // Remove empty index
  JSONS.shift();

  return JSONS
    .map((string) => `{"data":${string}`)
    .map((string) => JSON.parse(string));
};

async function tryQuery(repository, tryMergingToMain) {
  const commitsFromBranchString = await asyncExec(
    participantsQuery(repository, tryMergingToMain),
  );

  const separateJSONS = handleJSONsString(commitsFromBranchString.stdout);

  return separateJSONS;
}

export async function getPullRequests(repository) {
  let JSONSToWork;
  const separateJSONSMaster = await tryQuery(repository, false);

  const hasResults = separateJSONSMaster[0].data.repository.pullRequests.totalCount > 0;
  if (!hasResults) {
    const separateJSOSMain = await tryQuery(repository, true);
    JSONSToWork = separateJSOSMain;
  } else {
    JSONSToWork = separateJSONSMaster;
  }

  const arrayOfPullRequests = JSONSToWork
    .map((JSON) => JSON.data.repository.pullRequests.edges)
    .reduce((acc, JSON) => [...acc, ...JSON], []);

  return arrayOfPullRequests;
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

// await handlePullRequests('sd-026-b-project-recipes-app', 'alangmartini');

async function getUsersThatCommited(repository, branchName) {
  const commitsFromBranchString = await getCommitInfo(repository, branchName);

  const arrayOfCommitArrays = applyRegexAndParse(
    /(?<="nodes":)\[.*?\](?=,"pageInfo")/g,
    commitsFromBranchString.stdout,
  );

  const commitArrays = [...arrayOfCommitArrays[0]];

  const usersThatCommittedToTheBranchArray = commitArrays
    .map((commit) => commit.author.user.login);

  return usersThatCommittedToTheBranchArray;
}

function assertUserIsPresent(user, arrayOfUser) {
  return arrayOfUser.some((commitedUser) => commitedUser === user);
}

async function confirmUserHasCommitedInGroupBranch(repository, branchName, user) {
  const arrayOfUsersThatCommited = await getUsersThatCommited(repository, branchName);

  const isUserCommiter = assertUserIsPresent(user, arrayOfUser);
}

// await participantTeste(
//   'sd-026-b-project-recipes-app',
//   'main-group-19',
// );

// async function secondConfirmationIsUserBranch() {

// }
/*

 1) VERIFICA QUE SE TRATA DE  UM PROJETO EM GRUPO -> HAS MAIN-GROUP BRANCH
 2) CHECKA OS COMMITS THE TODAS AS BRANCHES MAIN-GROUP-XX
  QUE APONTAM PARA A MAIN PARA VER O USUÁRIO É AUTOR
*/
