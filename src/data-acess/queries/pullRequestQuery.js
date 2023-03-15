const pullRequestQuery = (repository) => `gh api graphql --paginate -f query='
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
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
  '`;

export default pullRequestQuery;
