const whatProjectsToUploadQuestion = (projectNames) => ([
  {
    type: 'checkbox',
    name: 'projectsToUpload',
    message: 'Marque todos os projetos que você quer subir',
    choices: [...projectNames],
    loop: false,
  }
]);

export default whatProjectsToUploadQuestion;