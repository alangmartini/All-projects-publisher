const ERRORS_TYPE = {
  FAILED_TO_PARSE: 'FAILED_TO_PARSE',
  BAD_REQUISITION: 'BAD_REQUISITION',
  NO_PROJECT_FOUND: 'NO_PROJECT_FOUND',
  FAILED_TO_EXEC_COMMAND: 'FAILED_TO_EXEC_COMMAND',
  NO_FOLDER_FOUND: 'NO_FOLDER_FOUND',
  FAILED_TO_CLONE: 'FAILED_TO_CLONE',
  WRONG_CLONING: 'WRONG_CLONING',
};

const ERRORS_OBJECT = {
  [ERRORS_TYPE.FAILED_TO_PARSE]: 'Failed to parse JSON of projects',
  [ERRORS_TYPE.BAD_REQUISITION]: 'Error ao requisitar os projetos'
  + ' atuais do Github da Trybe:',
  [ERRORS_TYPE.NO_PROJECT_FOUND]: 'Nenhum projeto encontrado para essa turma no github da Trybe.'
  + '\nSeu usuário deve estar correto e sua tribo apenas em números (ex: "26", e não 026)',
  [ERRORS_TYPE.NO_FOLDER_FOUND]: 'No folder found',
  [ERRORS_TYPE.FAILED_TO_EXEC_COMMAND]: 'Shell command has failed.',
  [ERRORS_TYPE.FAILED_TO_CLONE]: 'GitHub repository cloning failed',
  [ERRORS_TYPE.WRONG_CLONING]: 'Clone command was sucessfully executed'
  + ', but the repository was not found.',
};

module.exports = {
  ERRORS_OBJECT,
  ERRORS_TYPE,
};
