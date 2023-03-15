export default function getBranchNames(arrayOfObjectPR) {
  const allBranchesNames = arrayOfObjectPR.map(({ node }) => node.headRefName);
  return allBranchesNames;
}
