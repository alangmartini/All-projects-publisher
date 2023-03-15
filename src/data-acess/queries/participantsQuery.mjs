const handleQuery = (repository, isMergingToMain) => {
  const mainOrMaster = isMergingToMain ? 'main' : 'master';
  return `
  query ($endCursor: String) {
    repository(owner: "tryber", name: "${repository}") {
      pullRequests(first: 100, after: $endCursor, baseRefName: "${mainOrMaster}") {
        totalCount
        edges {
          node {
            baseRefName
            headRefName
            author {
              login
            }
            participants (first: 100) {
              nodes {
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

    `;
};

const participantsQuery = (repository, isMergingToMain) => 'gh api graphql --paginate'
  + ` -f query='${handleQuery(repository, isMergingToMain)}'`;

export default participantsQuery;
