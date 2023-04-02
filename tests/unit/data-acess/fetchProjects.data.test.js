/* eslint-disable prefer-arrow-callback */
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const { projectsAsMultiplePageGRAPHQL } = require('./mocks/trybeReponse.mock');
const executeCommandWrapper = require('../../../src/acess/acessLocal/execs/executeCommand.local');
const { fetchProjects } = require('../../../src/acess');
const fetchProjectsQuery = require('../../../src/acess/acessApi/queries/fetchProjects.query');
const { ERRORS_OBJECT, ERRORS_TYPE } = require('../../../src/errors/object.errors');

const { expect } = chai;
chai.use(sinonChai);

describe('Tests data.fetchProjects', function () {
  afterEach(function () {
    sinon.restore();
  });

  it('Should return a graphql string', async function () {
    // Create a sinon stub for asyncExec
    const asyncExecStub = sinon
      .stub(executeCommandWrapper, 'executeCommand')
        .resolves({ stdout: projectsAsMultiplePageGRAPHQL });
    
      const response = await fetchProjects();

    expect(response).to.deep.equal(projectsAsMultiplePageGRAPHQL);
    expect(asyncExecStub).to.have.been.calledWith(fetchProjectsQuery);
  });

  it('Should return a error: BAD_REQUISITION', async function () {
    const ERROR_OBJECT = {
      type: ERRORS_TYPE.BAD_REQUISITION,
      message: ERRORS_OBJECT.BAD_REQUISITION,
      error: new Error(),
    };

    const asyncExecStub = sinon
      .stub(executeCommandWrapper, 'executeCommand')
        .resolves({ stderr: 'Error' });
    
    const response = await fetchProjects();

    expect(response).to.deep.equal(ERROR_OBJECT);
    expect(asyncExecStub).to.have.been.calledWith(fetchProjectsQuery);
  });
});
