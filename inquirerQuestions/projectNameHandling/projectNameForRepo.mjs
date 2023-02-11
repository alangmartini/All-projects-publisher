const questionRepositoryNameFromInput = (repository) => [{
  type: 'input',
  name: 'repoName',
  message: `Insira aqui o novo nome para o projeto
    para o projeto ${repository}`,
}];

export default questionRepositoryNameFromInput;
