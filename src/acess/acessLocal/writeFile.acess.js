const fs = require('fs/promises');

async function writeFile(filePath, content) {
  await fs.writeFile(filePath, content, 'utf-8');
}

module.exports = {
  writeFile,
};
