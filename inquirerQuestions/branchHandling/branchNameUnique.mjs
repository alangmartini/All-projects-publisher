const questionBranchNameFromInput = (repository) => [{
  type: 'input',
  name: 'branchNameFromInput',
  message: `Insira aqui o nome da sua branch ou uma parte única dela \
    para o projeto ${repository}`
  }];

export default questionBranchNameFromInput;
