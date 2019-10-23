process.env.NODE_ENV = 'test';
let fs = require('fs');
let projectTestFileName = "project-test.json";
let content = fs.readFileSync(process.cwd() + "/tests/" + projectTestFileName).toString()

const assert = require("assert");
const mongoose = require('mongoose');
//const DB = require('mongoose').Db;
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const config = require('../../config/config');
const SERVER_APPLICATION_HOST = 'http://localhost:8080';
let chai = require('chai');
let chaiHttp = require('chai-http');
let Project = require('../../api/career/projects/project');
let Technology = require('../../api/career/projects/technology');
chai.use(chaiHttp);
let mongoServer;
let con;
let db;
const server = require('../../server');
const expect = chai.expect;
var should = require('chai').should()
const USER_ID = '5c48eada47227ff3460dce9b';
const PROJECTS_URL = '/api/projects/';

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

    let result = await chai.request(SERVER_APPLICATION_HOST).post(PROJECTS_URL).send(tempProject);

    result.body.errors.should.have.property('name');

    result.status.should.equal(400);

  });

  it('valid project given should return created response.', async () => {

    let tempProject = getProjectMock();

    let result = await chai.request(SERVER_APPLICATION_HOST).post(PROJECTS_URL).send(tempProject);

    result.body.project.should.have.property('_id');

    result.status.should.equal(201);

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

    //console.log('result %j', result);

    result.status.should.equal(404);

  });

  it('it should find by id.', async () => {

    let tempProject = getProjectMock();
    let setUpResult = await chai.request(SERVER_APPLICATION_HOST).post(PROJECTS_URL).send(tempProject);

    //console.log('%j', result);

    setUpResult.status.should.equal(201);

    let projectId = setUpResult.body.project._id;

    let findResult = await chai.request(SERVER_APPLICATION_HOST).get(PROJECTS_URL + projectId);

    findResult.status.should.equal(200);

    expect(findResult.body.project._id).to.equal(projectId);
  });

});
