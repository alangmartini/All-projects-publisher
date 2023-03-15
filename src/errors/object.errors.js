const errorsObject = {
  FAILED_TO_PARSE: 'Failed to parse JSON of projects',
  BAD_REQUISITION: (e) => `Error ao requisitar os projetos \
  atuais do Github da Trybe: ${e}`,
};

export default errorsObject;
