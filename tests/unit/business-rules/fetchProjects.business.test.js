/* eslint-disable prefer-arrow-callback */
// Tests inner working
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');

// Funcs
const dataAcess = require('../../../src/acess');
// const business = require('../../../src/business-rules/fetchProjects.business');
const business = require('../../../src/business-rules');
const utilsFetchProjects = require('../../../src/business-rules/api/utils.fetchProjects');

// Errors and mocks
const { ERRORS_OBJECT, ERRORS_TYPE } = require('../../../src/errors/object.errors');
const businessResponseMock = require('./mocks/businessFetchProjects.mock');
const dataAcessResponseMock = require('../data-acess/mocks/trybeReponse.mock');

const { expect } = chai;
chai.use(sinonChai);

describe('Tests business fetchProjects', function () {
  afterEach(function () {
    sinon.restore();
  });

  describe('Tests business parseJSONStringArr', function () {
    it('Should properly parse the graphql string', function () {
      // dataAcessResponseMock is a big string with concatenated JSONS
      const parsedJsons = utilsFetchProjects
        .parseJSONStringArr(dataAcessResponseMock.projectsAsMultiplePageGRAPHQL);

      expect(parsedJsons).to.deep.equal(businessResponseMock.parsedJsonsMock); 
    });
    it('Should properly return a error: FAILED_TO_PARSE', function () {
      const parsedJsons = utilsFetchProjects
      .parseJSONStringArr('Olá');

    expect(parsedJsons).to.deep.equal(
      {
      type: ERRORS_TYPE.FAILED_TO_PARSE,
      message: ERRORS_OBJECT.FAILED_TO_PARSE,
      error: new SyntaxError('Unexpected token O in JSON at position 0'),
      },
    ); 
    });
  });

  describe('Tests business extractProjectsNamesFromJSON', function () {
    it('Should return an array with project names', function () {
      const projectNames = utilsFetchProjects
        .extractProjectsNamesFromJSON(26, businessResponseMock.parsedJsonsMock);

      expect(projectNames).to.deep.equal(businessResponseMock.projectNamesMock);
    });
  });

  describe('Tests business.FetchProjects', function () {
      it('Should return an array with project names', async function () {
        // Create a sinon stub for asyncExec
        sinon
          .stub(dataAcess, 'fetchProjects')
          .resolves(dataAcessResponseMock.projectsAsMultiplePageGRAPHQL);
        
        const response = await business.fetchProjects(26);
    
        expect(response).to.deep.equal(businessResponseMock.projectNamesMock);
      });
      it(
        'Should return a error: BAD_REQUISITION. When data.fetchProjects return it',
        async function () {
        const ERROR_OBJECT = {
          type: ERRORS_TYPE.BAD_REQUISITION,
          message: ERRORS_OBJECT.BAD_REQUISITION,
          error: new Error(),
        };

        sinon
        .stub(dataAcess, 'fetchProjects')
        .resolves(ERROR_OBJECT);
      
      const response = await business.fetchProjects(26);
  
      expect(response).to.deep.equal(ERROR_OBJECT);
      },
      );
      it('Should return a error: NO_PROJECT_FOUND', async function () {
        const ERROR_OBJECT = { 
          type: ERRORS_TYPE.NO_PROJECT_FOUND,
          message: ERRORS_OBJECT.NO_PROJECT_FOUND,
          error: new Error(ERRORS_OBJECT.NO_PROJECT_FOUND),
        };
        sinon.stub(dataAcess, 'fetchProjects')
        .resolves(dataAcessResponseMock.projectsAsMultiplePageGRAPHQL);
    
        sinon.stub(utilsFetchProjects, 'extractProjectsNamesFromJSON').returns([]);

        const response = await business.fetchProjects(26);

        expect(response).to.deep.equal(ERROR_OBJECT);
      });
  });
});
