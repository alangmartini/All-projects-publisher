const { updateTrybePublisher } = require(
  '../../business-rules',
  );

async function removeLines194And197(trybePublisherPath) {
  try {
    await updateTrybePublisher
      .backupFile(trybePublisherPath.filePath, trybePublisherPath.backupFilePath);

    await updateTrybePublisher
      .processLines(trybePublisherPath.filePath, 194, 197);
  } catch (error) {
    console.error(error);
  }
}

async function restoreLines194And197(trybePublisherPath) {
  try {
    updateTrybePublisher
      .restoreFile(trybePublisherPath.filePath, trybePublisherPath.backupFilePath);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  removeLines194And197,
  restoreLines194And197,
};
