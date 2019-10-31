process.env.NODE_ENV = 'test';
let fs = require('fs');
let chai = require('chai');
let chaiHttp = require('chai-http');
let Project = require('../../api/career/projects/project');
let Technology = require('../../api/career/projects/technology');
const assert = require("assert");
const mongoose = require('mongoose');
const server = require('../../server');
var should = require('chai').should()
//const DB = require('mongoose').Db;
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const config = require('../../config/config');

let projectTestFileName = "project-test.json";
let content = fs.readFileSync(process.cwd() + "/tests/" + projectTestFileName).toString();

chai.use(chaiHttp);
let mongoServer;
let con;
let db;

const SERVER_APPLICATION_HOST = 'http://localhost:8080';
const expect = chai.expect;
const USER_ID = '5c48eada47227ff3460dce9b';
const PROJECTS_URL = '/api/projects/';
const PROJECTS_ADMIN_URL = '/admin/api/projects/';
const AUTHORIZATION_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';


function getProjectMock() {  
  return JSON.parse(content.replace(/(\r\n|\n|\r)/gm, ""));
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

describe('Project POST', () => {

  it('invalid project given should return bad request with error message.', async () => {

    let tempProject = getProjectMock();
    delete tempProject.name;

    let result = await postCall(PROJECTS_ADMIN_URL, tempProject);

    expect(result.body.error.message).to.have.string('The name is required');
    expect(result.status).to.equal(400);
  });

  it('valid project given should return created response.', async () => {

    let tempProject = getProjectMock();

    let result = await postCall(PROJECTS_ADMIN_URL, tempProject);

    expect(result.body.project).to.have.property('_id');
    expect(result.status).to.equal(201);
  });

  it('not token given should return unauthorized error.', async () => {

    let result = await chai.request(SERVER_APPLICATION_HOST).post(PROJECTS_ADMIN_URL).send(getProjectMock());

    expect(result.status).to.equal(401);

  });

});

describe('Projects FIND BY ID', () => {

  beforeEach((done) => {
    Project.deleteMany({}, (err) => {
      //done();
    });
    Technology.deleteMany({}, (err) => {
      done();
    });
  });

  it('it should not find by id.', async () => {
    let invalidProjectId = '1c48eada47227ff3460dce9a';

    let result = await chai.request(SERVER_APPLICATION_HOST).get(PROJECTS_URL + invalidProjectId);

    expect(result.status).to.equal(404);

  });

  it('it should find by id.', async () => {

    let tempProject = getProjectMock();
    let setUpResult = await postCall(PROJECTS_ADMIN_URL, tempProject);

    //console.log('%j', result);

    expect(setUpResult.status).to.equal(201);

    let projectId = setUpResult.body.project._id;

    let findResult = await chai.request(SERVER_APPLICATION_HOST).get(PROJECTS_URL + projectId);

    findResult.status.should.equal(200);

    expect(findResult.body.project._id).to.equal(projectId);
    expect(findResult.body.project.techs).to.have.lengthOf(tempProject.techs.length); 
  });

});


async function postCall(url, body) {
  return chai.request(SERVER_APPLICATION_HOST).post(url).set('authorization', AUTHORIZATION_TOKEN).send(body);
}