/* eslint-disable max-len */
const acess = require('../../acess');

async function removeLines(data, line1, line2) {
  const lines = data.split('\n');
  const targetLine1 = 'read -p "Tem certeza que deseja prosseguir? (N/s)" -n 1 -r';
  const targetLine2 = '[[ ! $REPLY =~ ^[Ss]$ ]] && TrybeWarn "Entendido! Nada será feito :)" && exit 1';

  const line1Exists = lines[line1 - 1] === targetLine1;
  const line2Exists = lines[line2 - 1] === targetLine2;

  if (!line1Exists || !line2Exists) {
    throw new Error('Lines 194 or 197 do not match the expected content.');
  }

  const updatedLines = lines.filter((_, index) => index !== line1 - 1 && index !== line2 - 1);
  return updatedLines.join('\n');
}

async function backupFile(filePath, backupFilePath) {
  const data = await acess.readFile(filePath);
  await acess.writeFile(backupFilePath, data);
}

async function restoreFile(filePath, backupFilePath) {
  const data = await acess.readFile(backupFilePath);
  await acess.writeFile(filePath, data);
  await acess.deleteFile(backupFilePath);
}

async function processLines(filePath, line1, line2) {
  const data = await acess.readFile(filePath);
  const updatedContent = await removeLines(data, line1, line2);
  await acess.writeFile(filePath, updatedContent);
}

module.exports = { 
  removeLines,
  backupFile,
  restoreFile,
  processLines,
 };
