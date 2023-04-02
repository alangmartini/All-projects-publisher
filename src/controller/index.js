const { cloneRepository } = require('./acessLocal/cloneRepository.controller');
const { deleteRepository } = require('./acessLocal/deleteRepository.controller');
const { uploadNewReadme } = require('./acessLocal/uploadNewReadme.controller');
const updateTrybePublisher = require('./acessLocal/updateTrybePublisher.controller');

module.exports = {
  cloneRepository,
  deleteRepository,
  uploadNewReadme,
  updateTrybePublisher,
};