const fetchProjectsQuery = `gh api graphql --paginate -f query='
query($endCursor: String) { 
  organization(login: "tryber") { 
    repositories(first: 100, after: $endCursor) {
      nodes { name }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
'`;
module.exports = fetchProjectsQuery; 
