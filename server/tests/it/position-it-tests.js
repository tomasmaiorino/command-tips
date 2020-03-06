process.env.NODE_ENV = 'test';
let fs = require('fs');
const assert = require("assert");
const sinon = require('sinon');
const mongoose = require('mongoose');
let should = require('chai').should()
const server = require('../../server');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
let chai = require('chai');
let chaiHttp = require('chai-http');
let Position = require('./../../api/career/positions/position');
let Project = require('./../../api/career/projects/project');

let positionTestFileName = "position-test.json";
let projectTestFileName = "project-test.json";
let content = fs.readFileSync(process.cwd() + "/tests/" + positionTestFileName).toString();
let projectContent = fs.readFileSync(process.cwd() + "/tests/" + projectTestFileName).toString();

chai.use(chaiHttp);
let mongoServer;
let con;
let db;

const expect = chai.expect;

const SERVER_APPLICATION_HOST = 'http://localhost:8080';
const USER_ID = '5c48eada47227ff3460dce9b';
const POSITION_ADMIN_URL = '/admin/api/positions/';
const POSITION_URL = '/api/positions/';
const POSITION_ID = '5c48eada47227ff3460dce9C';
const PROJECT_ID = '5c48eada47227ff3460dce9C';
const PROJECTS_URL = '/admin/api/projects/';
const AUTHORIZATION_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

process.env.GOOGLE_CLOUD_PROJECT = '123123';

function getFileObject(content) {
  return JSON.parse(content.replace(/(\r\n|\n|\r)/gm, ""));
}

function getPositionMock() {
  return getFileObject(content);
}

function getProjectMock() {
  return getFileObject(projectContent);
}

before((done) => {
  mongoServer = new MongoMemoryServer({ debug: false });
  mongoServer
    .getConnectionString()
    .then((mongoUri) => {
      return mongoose.connect(mongoUri, (err) => {
        if (err) done(err);
      });
    })
    .then(() => done())
    .catch(error => {
      console.debug('error ' + error);
    });
  //console.log('mongoServer ' + mongoServer);
});

after(() => {
  mongoose.disconnect();
  mongoServer.stop();
});

describe.skip('Positions POST', () => {

  beforeEach((done) => {
    Position.deleteMany({}, (err) => {
      done();
    });
  });

  afterEach(() => {
  })

  it('invalid position given should return bad request with error message.', async () => {

    let tempPosition = getPositionMock();
    delete tempPosition.name;

    let result = await postCall(POSITION_ADMIN_URL, tempPosition);

    expect(result.body.error.message).to.have.string('The name is required');
    expect(result.status).to.equal(400);

  });

  it('valid position given should create position.', async () => {

    let tempPosition = getPositionMock();;

    let result = await postCall(POSITION_ADMIN_URL, tempPosition);

    expect(result.body.position).to.have.property('_id');
    expect(result.status).to.equal(201);
  });


  it('not token given should return unauthorized error.', async () => {

    let result = await chai.request(SERVER_APPLICATION_HOST).post(POSITION_ADMIN_URL).send(getPositionMock());

    expect(result.status).to.equal(401);

  });

});

describe.skip('Adding project to position', () => {

  beforeEach((done) => {
    Position.deleteMany({}, (err) => {
      //done();
    });
    Project.deleteMany({}, (err) => {
      done();
    });
  });

  it('not found position given should return not found.', async () => {

    let projectIds = { 'projectIds': [PROJECT_ID] };
    let result = await postCall(POSITION_ADMIN_URL + POSITION_ID, projectIds);

    //console.log('%j', result.body);

    expect(result.status).to.equal(404);

  });

  it('project not found given should return bad request', async () => {

    let tempPosition = getPositionMock();

    let result = await postCall(POSITION_ADMIN_URL, tempPosition);

    let positionId = result.body.position._id;

    let projectIds = { 'projectIds': [PROJECT_ID] };
    let secondResult = await postCall(POSITION_ADMIN_URL + positionId, projectIds);

    //console.log('%j', result.body);

    expect(secondResult.status).to.equal(400);

  });

  it('all projects given not found given should return bad request', async () => {

    let tempProject = getProjectMock();

    let projectResult = await postCall(PROJECTS_URL, tempProject);

    let createdProjectId = projectResult.body.project._id;

    let tempPosition = getPositionMock();

    let result = await postCall(POSITION_ADMIN_URL, tempPosition);

    let positionId = result.body.position._id;

    let projectIds = { 'projectIds': [createdProjectId, PROJECT_ID] };
    let secondResult = await postCall(POSITION_ADMIN_URL + positionId, projectIds);

    //console.log('%j', result.body);

    expect(secondResult.status).to.equal(400);

  });

  it('valid projects given should return ok', async () => {

    let tempProject = getProjectMock();

    let projectResult = await postCall(PROJECTS_URL, tempProject);

    let firstProjectId = projectResult.body.project._id;

    tempProject = getProjectMock();

    projectResult = await postCall(PROJECTS_URL, tempProject);

    let secondProjectId = projectResult.body.project._id;

    let tempPosition = getPositionMock();

    let result = await postCall(POSITION_ADMIN_URL, tempPosition);

    let positionId = result.body.position._id;

    let projectIds = { 'projectIds': [firstProjectId, secondProjectId] };
    let secondResult = await postCall(POSITION_ADMIN_URL + positionId, projectIds);

    console.log('position it created position %j', result.body.position.projects.length);

    expect(secondResult.status).to.equal(200);

    expect(secondResult.body.position.projects).to.have.lengthOf(projectIds.projectIds.length);

  });

});

describe.skip('Positions GET', () => {

  beforeEach((done) => {
    Position.deleteMany({}, (err) => {
      done();
    });
  });

  it('not found position given should return not found error', async () => {

    let result = await chai.request(SERVER_APPLICATION_HOST).get(POSITION_URL + POSITION_ID).send();

    expect(result.status).to.equal(404);

  });

  it('valid position given should return position found', async () => {

    let tempPosition = getPositionMock();;

    let result = await postCall(POSITION_ADMIN_URL, tempPosition);

    let positionId = result.body.position._id;

    expect(result.status).to.equal(201);

    let getResult = await chai.request(SERVER_APPLICATION_HOST).get(POSITION_URL + positionId).send();

    expect(getResult.status).to.equal(200);

    getResult.body.position._id.should.equal(positionId);

  });

});

async function postCall(url, body) {
  return chai.request(SERVER_APPLICATION_HOST).post(url).set('authorization', AUTHORIZATION_TOKEN).send(body);
}