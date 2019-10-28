process.env.NODE_ENV = 'test';
let fs = require('fs');
const assert = require("assert");
const mongoose = require('mongoose');
let positionTestFileName = "position-test.json";
let content = fs.readFileSync(process.cwd() + "/tests/" + positionTestFileName).toString()
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const SERVER_APPLICATION_HOST = 'http://localhost:8080';
let chai = require('chai');
let chaiHttp = require('chai-http');
let Position = require('./../../api/career/positions/position');
chai.use(chaiHttp);
let mongoServer;
let con;
let db;
const expect = chai.expect;
var should = require('chai').should()
const USER_ID = '5c48eada47227ff3460dce9b';
const POSITION_URL = '/api/positions/';


function getPositionMock() {
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

describe('Positions POST', () => {

  beforeEach((done) => {
    Position.deleteMany({}, (err) => {
      done();
    });
  });

  it('invalid position given should return bad request with error message.', async () => {

    let tempPosition = getPositionMock();
    delete tempPosition.name;

    let result = await chai.request(SERVER_APPLICATION_HOST).post(POSITION_URL).send(tempPosition);

    //console.log('%j', result.body);

    result.body.errors.should.have.property('name');

    result.status.should.equal(400);

  });

  it('valid position given should create position.', async () => {

    let tempPosition = getPositionMock();;

    let result = await chai.request(SERVER_APPLICATION_HOST).post(POSITION_URL).send(tempPosition);

    result.body.position.should.have.property('_id');

    result.status.should.equal(201);

  });

});