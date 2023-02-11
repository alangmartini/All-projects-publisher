const branchesStardartQuestion = [
  {
    type: 'list',
    name: '_',
    message: `O ideal é que suas branches tenham o mesmo padrão (por exemplo:
    bob-mackbob-project) já que o sh da trybe pega por uma instância do nome.`,
    choices: ['ok', 'também ok'],
  },
  {
    type: 'list',
    name: 'areBranchesStandartized',
    message: `Todas suas branchs estão padronizadas, 
    ou pelo menos possuem um nome em comum?
    (possuem pelo menos mackbob em cada uma)
    Caso não, nos próximos passos você deverá, para cada projeto, dar o nome da branch`,
    choices: ['Sim', 'Não'],
  },
];

export default branchesStardartQuestion;
