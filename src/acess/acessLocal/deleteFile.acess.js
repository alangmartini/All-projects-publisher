const fs = require('fs/promises');

async function deleteFile(filePath) {
  await fs.unlink(filePath);
}

module.exports = { deleteFile };
