const handleMultiplePrsQuestion = (allBranchesOptions) => ([
  {
    type: 'rawlist',
    name: 'chosenBranch',
    message: 'Foram encotrado múltiplas branchs em que você é o autor!'
    + ' Escolha a correta (que será utilizada para criar o novo repostório)',
    choices: [...allBranchesOptions],
    loop: false,
  },
]);

module.exports = { handleMultiplePrsQuestion }
