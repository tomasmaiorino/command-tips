process.env.NODE_ENV = 'test';
const assert = require("assert");
const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const config = require('../../config/config');
const SERVER_APPLICATION_HOST = 'http://localhost:8080';
let chai = require('chai');
let chaiHttp = require('chai-http');
let Command = require('./../../api/commands/command');
chai.use(chaiHttp);
let mongoServer;
const server = require('../../server');
const expect = chai.expect;
var should = require('chai').should()
const TAGS_URI = '/api/tags/';
const tagController = require('../../api/tags/tagController');
const Tags = require('../../api/tags/tag');

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
  Tags.remove({})
  mongoose.disconnect();
  mongoServer.stop();
});

describe('Tags', () => {

  beforeEach((done) => {
    Tags.deleteMany({}, (err) => {
      done();
    });
  });

  it('should return all tags.', async () => {

    let savedTag = await tagController.save({ 'value': 'MAVEN' });
    savedTag = await tagController.save({ 'value': 'GIT' });

    let result = await chai.request(SERVER_APPLICATION_HOST).get(TAGS_URI);
    result.status.should.equal(200);

    result.body.tags.length.should.equal(2);

  });

});
