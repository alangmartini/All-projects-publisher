const fs = require('fs/promises');

async function readFile(filePath) {
  const fileData = await fs.readFile(filePath, 'utf-8');
  return fileData;
}
module.exports = { readFile };
