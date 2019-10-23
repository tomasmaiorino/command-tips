process.env.NODE_ENV = 'test';
const assert = require("assert");
const mongoose = require('mongoose');
//const DB = require('mongoose').Db;
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const config = require('../../config/config');
const SERVER_APPLICATION_HOST = 'http://localhost:8080';
let chai = require('chai');
let chaiHttp = require('chai-http');
let Command = require('./../../api/commands/command');
chai.use(chaiHttp);
let mongoServer;
let con;
let db;
const server = require('../../server');
const expect = chai.expect;
var should = require('chai').should()
const USER_ID = '5c48eada47227ff3460dce9b';
const COMMANDS_URL = '/api/tips/';

const COMMAND_OBJECT_MOCK = {
  "title": "Executing a cucumber test through maven using an specif tag.",
  "command": "mvn test -DskipTest",
  "links": "",
  /*"userId": "5c48eada47227ff3460dce9b",*/
  "tags": "MAVEN"
}

function getCommandMock() {
  return {
    "title": "Executing a cucumber test through maven using an specif tag.",
    "command": "mvn test",
    "links": "",
    /*"userId": "5c48eada47227ff3460dce9b",*/
    "tags": "MAVEN"
  }
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

describe('Commands PATCH', () => {

  it('not found command given should return not found.', async () => {

    let invalidCommandId = '5c48eada47227ff3460dce9a';
    let result = await chai.request(SERVER_APPLICATION_HOST).patch(COMMANDS_URL + invalidCommandId).send({});
    result.status.should.equal(404);

  });

  it('not allowed params given should return bad request.', async () => {

    let setUpResult = await chai.request(SERVER_APPLICATION_HOST).post(COMMANDS_URL).send(COMMAND_OBJECT_MOCK);
    setUpResult.status.should.equal(201);

    let patchBody = {
      attribute: '_id'
    }

    let commandId = setUpResult.body.command._id;
    let result = await chai.request(SERVER_APPLICATION_HOST).patch(COMMANDS_URL + commandId).send(patchBody);
    result.status.should.equal(400);

  });

  it('not found params given should return bad request.', async () => {

    let setUpResult = await chai.request(SERVER_APPLICATION_HOST).post(COMMANDS_URL).send(COMMAND_OBJECT_MOCK);
    setUpResult.status.should.equal(201);

    let patchBody = {
      attribute: 'temparature'
    }

    let commandId = setUpResult.body.command._id;
    let result = await chai.request(SERVER_APPLICATION_HOST).patch(COMMANDS_URL + commandId).send(patchBody);
    result.status.should.equal(400);

  });

  it('changed title given should return ok.', async () => {

    let setUpResult = await chai.request(SERVER_APPLICATION_HOST).post(COMMANDS_URL).send(COMMAND_OBJECT_MOCK);
    setUpResult.status.should.equal(201);

    let patchBody = {
      attribute: 'title',
      value: 'new title'
    }

    let commandId = setUpResult.body.command._id;
    let result = await chai.request(SERVER_APPLICATION_HOST).patch(COMMANDS_URL + commandId).send(patchBody);

    result.status.should.equal(200);

    expect(result.body.command.title).to.equal(patchBody.value);

  });

  it('increment it works should return ok.', async () => {

    let setUpResult = await chai.request(SERVER_APPLICATION_HOST).post(COMMANDS_URL).send(COMMAND_OBJECT_MOCK);
    setUpResult.status.should.equal(201);

    let patchBody = {
      attribute: 'works',
      increment: true
    }

    let commandId = setUpResult.body.command._id;
    let result = await chai.request(SERVER_APPLICATION_HOST).patch(COMMANDS_URL + commandId).send(patchBody);

    result.status.should.equal(200);

    // console.log('%j', result.body);

    expect(result.body.command.works).to.equal(1);

  });

  it('decrement it works should return ok.', async () => {

    let setUpResult = await chai.request(SERVER_APPLICATION_HOST).post(COMMANDS_URL).send(COMMAND_OBJECT_MOCK);
    setUpResult.status.should.equal(201);

    let patchBody = {
      attribute: 'doesnt_work',
      increment: true
    }

    let commandId = setUpResult.body.command._id;
    let result = await chai.request(SERVER_APPLICATION_HOST).patch(COMMANDS_URL + commandId).send(patchBody);

    result.status.should.equal(200);

    //console.log('%j', result.body);

    expect(result.body.command.works).to.equal(0);
    expect(result.body.command.doesnt_work).to.equal(1);

  });

  it('update tags title given should return ok.', async () => {

    let setUpResult = await chai.request(SERVER_APPLICATION_HOST).post(COMMANDS_URL).send(COMMAND_OBJECT_MOCK);
    setUpResult.status.should.equal(201);

    let patchBody = {
      attribute: 'tags',
      value: setUpResult.body.command.tags + ' ' + 'GIT'
    }

    let commandId = setUpResult.body.command._id;
    let result = await chai.request(SERVER_APPLICATION_HOST).patch(COMMANDS_URL + commandId).send(patchBody);

    result.status.should.equal(200);

    //console.log('%j', result.body);

    expect(result.body.command.tags).to.equal(patchBody.value);

  });

});

describe('Commands POST', () => {

  it('invalid command given should return bad request with error message.', async () => {

    let tempCommand = getCommandMock();;
    delete tempCommand.title;

    let result = await chai.request(SERVER_APPLICATION_HOST).post(COMMANDS_URL).send(tempCommand);

    //console.log('%j', result.body);

    result.body.errors.should.have.property('title');

    result.status.should.equal(400);

  });

  it('valid command given should return bad request with error message.', async () => {

    let tempCommand = getCommandMock();;

    let result = await chai.request(SERVER_APPLICATION_HOST).post(COMMANDS_URL).send(tempCommand);

    result.body.command.should.have.property('_id');

    result.status.should.equal(201);

  });

});

describe('Commands FIND BY ID', () => {

  beforeEach((done) => {
    Command.deleteMany({}, (err) => {
      done();
    });
  });

  it('it should not find by id.', async () => {
    let invalidCommandId = '5c48eada47227ff3460dce9a';

    let result = await chai.request(SERVER_APPLICATION_HOST).get(COMMANDS_URL + invalidCommandId);

    result.status.should.equal(404);

  });

  it('it should find by id.', async () => {

    let setUpResult = await chai.request(SERVER_APPLICATION_HOST).post(COMMANDS_URL).send(COMMAND_OBJECT_MOCK);

    //console.log('%j', result);

    setUpResult.status.should.equal(201);

    let commandId = setUpResult.body.command._id;

    let findResult = await chai.request(SERVER_APPLICATION_HOST).get(COMMANDS_URL + commandId);

    findResult.status.should.equal(200);

    expect(findResult.body.command._id).to.equal(commandId);
  });

});

describe('Commands QUERY', () => {

  beforeEach((done) => {
    Command.deleteMany({}, (err) => {
      done();
    });
  });

  it('not valid query given should return empty commands array.', async () => {

    let setUpResult = await chai.request(SERVER_APPLICATION_HOST).post(COMMANDS_URL).send(COMMAND_OBJECT_MOCK);

    setUpResult.status.should.equal(201);

    let query = 'query';

    let testResult = await chai.request(SERVER_APPLICATION_HOST).get(COMMANDS_URL + 'search/' + query);

    testResult.status.should.equal(200);

    testResult.body.commands.length.should.equal(0);

  });

  it('valid query by command given should return empty commands array.', async () => {

    let setUpResult = await chai.request(SERVER_APPLICATION_HOST).post(COMMANDS_URL).send(COMMAND_OBJECT_MOCK);

    setUpResult.status.should.equal(201);

    let query = setUpResult.body.command.command.substring(0, 4);

    let testResult = await chai.request(SERVER_APPLICATION_HOST).get(COMMANDS_URL + 'search/' + query);

    testResult.status.should.equal(200);

    testResult.body.commands.length.should.equal(1);

  });

});

describe('Commands TAGS', () => {

  beforeEach((done) => {
    Command.deleteMany({}, (err) => {
      done();
    });
  });

  it('it should not find by tag.', async () => {

    let setUpResult = await chai.request(SERVER_APPLICATION_HOST).post(COMMANDS_URL).send(COMMAND_OBJECT_MOCK);

    setUpResult.status.should.equal(201);

    let invalidTag = 'invalid';

    let testResult = await chai.request(SERVER_APPLICATION_HOST).get(COMMANDS_URL + 'tags/' + invalidTag);

    testResult.status.should.equal(404);

  });


  it('it should find by tag.', async () => {

    let result = await chai.request(SERVER_APPLICATION_HOST).post(COMMANDS_URL).send(COMMAND_OBJECT_MOCK);

    result = await chai.request(SERVER_APPLICATION_HOST).post(COMMANDS_URL).send(COMMAND_OBJECT_MOCK);

    result.status.should.equal(201);

    let validTag = result.body.command.tags;

    let testResult = await chai.request(SERVER_APPLICATION_HOST).get(COMMANDS_URL + 'tags/' + validTag);

    testResult.status.should.equal(200);

    testResult.body.commands[0].should.have.property('_id');

    testResult.body.commands[0].tags.should.equal(validTag);

    testResult.body.commands.length.should.equal(2);

  });

});