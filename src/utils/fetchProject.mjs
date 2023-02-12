/* eslint-disable no-restricted-syntax */
const query = `gh api graphql --paginate -f query='
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

async function fetchProjects(triboAtual) {
  let repositories;
  try {
    const { stdout, stderr } = await asyncExec(query);
    // const reg = new RegExp(`sd-0${triboAtual}-[ab]-project.*?(?="},)`, 'g');
    const reg = new RegExp(`sd-0${triboAtual}-[ab].*?(?="},)`, 'g');
    const matchIterator = stdout.matchAll(reg);

    const repositoriesArr = [];
    for (const match of matchIterator) {
      repositoriesArr.push(match[0]);
    }

    repositories = repositoriesArr;

    if (stderr) {
      throw new Error(stderr);
    }
  } catch (err) {
    console.error(err);
  }

  return repositories;
}

export default fetchProjects;
