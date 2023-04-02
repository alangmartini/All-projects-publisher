const business = require('../../business-rules');

async function uploadNewReadme(repository) {
  await business.validateAndUploadNewReadme(repository);
}

module.exports = {
  uploadNewReadme,
};