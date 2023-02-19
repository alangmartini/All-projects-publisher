import asyncExec from './asyncExec.mjs';
import applyRegexAndParse from './applyRegexAndParse.mjs';

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

async function teste(repository, branchName) {
  const query = `
  query ($endCursor: String) {
    repository(owner: "tryber", name: "${repository}") {  
      pullRequests (first: 100, after: $endCursor) {
        edges {
          node {
            baseRefName
            headRefName
            author {
              login
            }
          commits (first: 100, after: $endCursor) {
              nodes {
                commit {
                  author {
                    user {
                      login
                    }
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
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
  `;

  const commitsFromBranchString = await asyncExec(
    `gh api graphql --paginate -f query='${query}'`,
  );

  console.log(commitsFromBranchString.stdout)
  return commitsFromBranchString.stdout;
}

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

await teste(
  'sd-026-b-project-recipes-app',
  'main-group-19',
);

// async function secondConfirmationIsUserBranch() {

// }
