const ERRORS_TYPE = {
  FAILED_TO_PARSE: 'FAILED_TO_PARSE',
  BAD_REQUISITION: 'BAD_REQUISITION',
  NO_PROJECT_FOUND: 'NO_PROJECT_FOUND',
};

const ERRORS_OBJECT = {
  [ERRORS_TYPE.FAILED_TO_PARSE]: 'Failed to parse JSON of projects',
  [ERRORS_TYPE.BAD_REQUISITION]: 'Error ao requisitar os projetos'
  + ' atuais do Github da Trybe:',
  [ERRORS_TYPE.NO_PROJECT_FOUND]: 'Nenhum projeto encontrado para essa turma no github da Trybe.'
  + '\nSeu usuário deve estar correto e sua tribo apenas em números (ex: "26", e não 026)',
};

module.exports = {
  ERRORS_OBJECT,
  ERRORS_TYPE,
};
