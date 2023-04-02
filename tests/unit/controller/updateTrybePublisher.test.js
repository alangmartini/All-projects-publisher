const sinon = require('sinon');
const { expect } = require('chai');
const { updateTrybePublisher } = require('../../../src/controller');
// const { trybePublisherMock } = require('./mocks/trybePublisher.mock');
// const { updatedTrybePublisher } = require('./mocks/updatedTrybePublisher.mock');
const acess = require('../../../src/acess');

// Mocks trybePublisher content
let contentMock;
let backupContent;
let readFileMock;
let writeFileMock;

const createBackUpFile = async (_path, data) => {
  backupContent = data;
};

const updateContent = async (_path, data) => {
  contentMock = data;
};

const trybePublisherPathMock = {
  filePath: './cool/path',
  backupFilePath: './another/cool/path',
};

beforeEach(function () {
  contentMock = trybePublisherMock;
  readFileMock = sinon.stub(acess, 'readFile').resolves(trybePublisherMock);
});

afterEach(function () {
  sinon.restore();
  contentMock = null;
  backupContent = null;
});

describe('updateTrybePublisher', function () {
  describe('removeLines194And197', function () {
    it.only('Should update trybePublisher', async function () {
      const writeFileStub = sinon.stub(acess, 'writeFile');
      let callCount = 0;
      writeFileStub.callsFake(async (path, data) => {
        if (callCount === 0) {
          await createBackUpFile(path, data);
        } else if (callCount === 1) {
          await updateContent(path, data);
        }
        callCount += 1;
      });

      // sinon stub for acess
      await updateTrybePublisher.removeLines194And197(trybePublisherPathMock);

      expect(contentMock.split('\n').length).to.be.equal(updatedTrybePublisher.split('\n').length);
    });
  
    it('Deve chamar processLines com os parâmetros corretos', async function () {
      // TODO
    });
  });
  
  describe('restoreLines194And197', function () {
    it('Deve chamar restoreFile com os parâmetros corretos', async function () {
      // TODO
    });
  });
});