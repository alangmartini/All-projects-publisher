const useDefaultNameForProjectsQuestion = [{
  type: 'list',
  name: 'useDefaultNameForProjects',
  message: 'Todos projetos devem ser renomeados.'
  + 'Você gostaria de fazer isso agora ou depois pelo Github?'
  + '(caso deixe para depois, um nome diferente padrão será gerado)',
  choices: ['Agora', 'Depois'],
}];

export default useDefaultNameForProjectsQuestion;
