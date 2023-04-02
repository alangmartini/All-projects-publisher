const path = require('path');
const { backupFile, processLines, restoreFile } = require(
  '../../business-rules/local/updateTrybePublisher.business',
  );

const trybePublisherPath = {
    filePath: path.join('/usr/local/bin', 'trybe-publisher'),
    backupFilePath: path.join('/usr/local/bin', 'trybe-publisher.bak'),
};

async function removeLines194And197() {
  try {
    await backupFile(trybePublisherPath.filePath, trybePublisherPath.backupFilePath);

    await processLines(trybePublisherPath.filePath, 194, 197);
  } catch (error) {
    console.error(error);
  }
}

async function restoreLines194And197() {
  try {
    restoreFile(trybePublisherPath.filePath, trybePublisherPath.backupFilePath);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  removeLines194And197,
  restoreLines194And197,
};
