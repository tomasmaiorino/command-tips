process.env.NODE_ENV = 'test';
process.env.GOOGLE_APPLICATION_CREDENTIALS = "{}";
const sinon = require("sinon");
const assert = require("assert");
const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const config = require('../../config/config');
let should = require('chai').should()
let Command = require('./../../api/commands/Command');
let chai = require('chai');
let chaiHttp = require('chai-http');

let firebaseHelper = require('../../api/util/FirebaseHelper');

chai.use(chaiHttp);
let mongoServer;
let con;
let db;

const expect = chai.expect;
const SERVER_APPLICATION_HOST = 'http://localhost:8080';
const USER_ID = '5c48eada47227ff3460dce9b';
const COMMANDS_URL = '/api/tips/';
const COMMANDS_ADMIN_URL = '/admin/api/commands/';
const AUTHORIZATION_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

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

  let getUserInfoStub, firebaseHelperStub, server;

  before(() => {
    firebaseHelperStub = sinon.stub(firebaseHelper, 'initialize');
    server = require('../../server');
  })

  beforeEach((done) => {
    getUserInfoStub = sinon.stub(firebaseHelper, 'getUserInfo').returns({ 'uid': '12123123123' });
    Command.deleteMany({}, (err) => {
      done();
    });
  });

  afterEach(() => {
    getUserInfoStub.restore();
  });

  after(() => {
    firebaseHelperStub.restore();
  });

  it('not found command given should return not found.', async () => {

    let invalidCommandId = '5c48eada47227ff3460dce9a';
    let result = await patchCall(COMMANDS_ADMIN_URL + invalidCommandId, {});
    result.status.should.equal(404);

  });

  it('not allowed params given should return bad request.', async () => {

    let setUpResult = await postCall(COMMANDS_ADMIN_URL, getCommandMock());
    setUpResult.status.should.equal(201);

    let patchBody = {
      attribute: '_id'
    }

    let commandId = setUpResult.body.command._id;
    let result = await patchCall(COMMANDS_ADMIN_URL + commandId, patchBody);
    result.status.should.equal(400);

  });

  it('not found params given should return bad request.', async () => {

    let setUpResult = await postCall(COMMANDS_ADMIN_URL, getCommandMock());
    setUpResult.status.should.equal(201);

    let patchBody = {
      attribute: 'temparature'
    }

    let commandId = setUpResult.body.command._id;
    let result = await patchCall(COMMANDS_ADMIN_URL + commandId, patchBody);
    result.status.should.equal(400);

  });

  it('changed title given should return ok.', async () => {

    let setUpResult = await postCall(COMMANDS_ADMIN_URL, getCommandMock());
    setUpResult.status.should.equal(201);

    let patchBody = {
      attribute: 'title',
      value: 'new title'
    }

    let commandId = setUpResult.body.command._id;
    let result = await patchCall(COMMANDS_ADMIN_URL + commandId, patchBody);

    result.status.should.equal(200);

    expect(result.body.command.title).to.equal(patchBody.value);

  });

  it('increment it works should return ok.', async () => {

    let setUpResult = await postCall(COMMANDS_ADMIN_URL, getCommandMock());
    setUpResult.status.should.equal(201);

    let patchBody = {
      attribute: 'works',
      increment: true
    }

    let commandId = setUpResult.body.command._id;
    let result = await patchCall(COMMANDS_ADMIN_URL + commandId, patchBody);

    result.status.should.equal(200);

    // console.log('%j', result.body);

    expect(result.body.command.works).to.equal(1);

  });

  it('decrement it works should return ok.', async () => {

    let setUpResult = await postCall(COMMANDS_ADMIN_URL, getCommandMock());
    setUpResult.status.should.equal(201);

    let patchBody = {
      attribute: 'doesnt_work',
      increment: true
    }

    let commandId = setUpResult.body.command._id;
    let result = await patchCall(COMMANDS_ADMIN_URL + commandId, patchBody);

    result.status.should.equal(200);

    //console.log('%j', result.body);

    expect(result.body.command.works).to.equal(0);
    expect(result.body.command.doesnt_work).to.equal(1);

  });

  it('update tags title given should return ok.', async () => {

    let setUpResult = await postCall(COMMANDS_ADMIN_URL, getCommandMock());
    setUpResult.status.should.equal(201);

    let patchBody = {
      attribute: 'tags',
      value: setUpResult.body.command.tags + ' ' + 'GIT'
    }

    let commandId = setUpResult.body.command._id;
    let result = await patchCall(COMMANDS_ADMIN_URL + commandId, patchBody);

    result.status.should.equal(200);

    //console.log('%j', result.body);

    expect(result.body.command.tags).to.equal(patchBody.value);

  });


  it.skip('patch not token given should return unauthorized error.', async () => {

    let result = await chai.request(SERVER_APPLICATION_HOST).patch(COMMANDS_ADMIN_URL).send(getCommandMock());

    result.status.should.equal(401);

  });

});

describe('Commands POST', () => {

  let getUserInfoStub, firebaseHelperStub, server;

  before(() => {
    firebaseHelperStub = sinon.stub(firebaseHelper, 'initialize');
    server = require('../../server');
  })

  beforeEach((done) => {
    getUserInfoStub = sinon.stub(firebaseHelper, 'getUserInfo').returns({ 'uid': '12123123123' });
    Command.deleteMany({}, (err) => {
      done();
    });
  });

  afterEach(() => {
    getUserInfoStub.restore();
  });

  after(() => {
    firebaseHelperStub.restore();
  });

  it('invalid command given should return bad request with error message.', async () => {

    let tempCommand = getCommandMock();
    delete tempCommand.title;

    let result = await postCall(COMMANDS_ADMIN_URL, tempCommand);

    //console.log('command post invalid param %j', result.body);

    expect(result.body.error.message).to.have.string('The title is required');

    result.status.should.equal(400);

  });

  it('valid command given should return bad request with error message.', async () => {

    let tempCommand = getCommandMock();;

    let result = await postCall(COMMANDS_ADMIN_URL, tempCommand);

    result.body.command.should.have.property('_id');

    result.status.should.equal(201);

  });

  it.skip('not token given should return unauthorized error.', async () => {

    let result = await chai.request(SERVER_APPLICATION_HOST).post(COMMANDS_ADMIN_URL).send(getCommandMock());

    expect(result.status).to.equal(401);

  });

});


describe('Commands DELETE BY ID', () => {
  let getUserInfoStub, firebaseHelperStub, server;

  before(() => {
    firebaseHelperStub = sinon.stub(firebaseHelper, 'initialize');
    server = require('../../server');
  })

  beforeEach((done) => {
    getUserInfoStub = sinon.stub(firebaseHelper, 'getUserInfo').returns({ 'uid': '12123123123' });
    Command.deleteMany({}, (err) => {
      done();
    });
  });

  afterEach(() => {
    getUserInfoStub.restore();
  });

  after(() => {
    firebaseHelperStub.restore();
  });

  it('it should not find by id.', async () => {
    let invalidCommandId = '5c48eada47227ff3460dce9a';

    let result = await chai.request(SERVER_APPLICATION_HOST).delete(COMMANDS_ADMIN_URL + invalidCommandId);

    expect(result.status).to.equal(404);

  });

  it('it should delete by id.', async () => {

    let setUpResult = await postCall(COMMANDS_ADMIN_URL, getCommandMock());

    expect(setUpResult.status).to.equal(201);

    let commandId = setUpResult.body.command._id;

    let findResult = await chai.request(SERVER_APPLICATION_HOST).delete(COMMANDS_ADMIN_URL + commandId);

    expect(findResult.status).to.equal(204);

    let assertResult = await chai.request(SERVER_APPLICATION_HOST).get(COMMANDS_URL + commandId);

    expect(assertResult.status).to.equal(404);

  });

});


describe('Commands FIND BY ID', () => {
  let getUserInfoStub, firebaseHelperStub, server;

  before(() => {
    firebaseHelperStub = sinon.stub(firebaseHelper, 'initialize');
    server = require('../../server');
  })

  beforeEach((done) => {
    getUserInfoStub = sinon.stub(firebaseHelper, 'getUserInfo').returns({ 'uid': '12123123123' });
    Command.deleteMany({}, (err) => {
      done();
    });
  });

  afterEach(() => {
    getUserInfoStub.restore();
  });

  after(() => {
    firebaseHelperStub.restore();
  });

  it('it should not find by id.', async () => {
    let invalidCommandId = '5c48eada47227ff3460dce9a';

    let result = await chai.request(SERVER_APPLICATION_HOST).get(COMMANDS_URL + invalidCommandId);

    expect(result.status).to.equal(404);

  });

  it('it should find by id.', async () => {

    let setUpResult = await postCall(COMMANDS_ADMIN_URL, getCommandMock());

    //console.log('%j', result);

    expect(setUpResult.status).to.equal(201);

    let commandId = setUpResult.body.command._id;

    let findResult = await chai.request(SERVER_APPLICATION_HOST).get(COMMANDS_URL + commandId);

    expect(findResult.status).to.equal(200);
    expect(findResult.body.command._id).to.equal(commandId);
  });

});

describe('Commands QUERY', () => {

  let getUserInfoStub, firebaseHelperStub, server;

  before(() => {
    firebaseHelperStub = sinon.stub(firebaseHelper, 'initialize');
    server = require('../../server');
  })

  beforeEach((done) => {
    getUserInfoStub = sinon.stub(firebaseHelper, 'getUserInfo').returns({ 'uid': '12123123123' });
    Command.deleteMany({}, (err) => {
      done();
    });
  });

  afterEach(() => {
    getUserInfoStub.restore();
  });

  after(() => {
    firebaseHelperStub.restore();
  });

  it('not valid query given should return empty commands array.', async () => {

    let setUpResult = await postCall(COMMANDS_ADMIN_URL, getCommandMock());

    expect(setUpResult.status).to.equal(201);

    let query = 'query';

    let testResult = await chai.request(SERVER_APPLICATION_HOST).get(COMMANDS_URL + 'search/' + query);

    expect(testResult.status).to.equal(200);
    expect(testResult.body.commands).to.have.lengthOf(0);
  });

  it('valid query by command given should return empty commands array.', async () => {

    let setUpResult = await postCall(COMMANDS_ADMIN_URL, getCommandMock());

    expect(setUpResult.status).to.equal(201);

    let query = setUpResult.body.command.command.substring(0, 4);

    let testResult = await chai.request(SERVER_APPLICATION_HOST).get(COMMANDS_URL + 'search/' + query);

    expect(testResult.status).to.equal(200);
    expect(testResult.body.commands).to.have.lengthOf(1);
  });

});

describe('Commands TAGS', () => {

  let getUserInfoStub, firebaseHelperStub, server;

  before(() => {
    firebaseHelperStub = sinon.stub(firebaseHelper, 'initialize');
    server = require('../../server');
  })

  beforeEach((done) => {
    getUserInfoStub = sinon.stub(firebaseHelper, 'getUserInfo').returns({ 'uid': '12123123123' });
    Command.deleteMany({}, (err) => {
      done();
    });
  });

  afterEach(() => {
    getUserInfoStub.restore();
  });

  after(() => {
    firebaseHelperStub.restore();
  });

  it('it should not find by tag.', async () => {

    let setUpResult = await postCall(COMMANDS_ADMIN_URL, getCommandMock());

    expect(setUpResult.status).to.equal(201);

    let invalidTag = 'invalid';

    let testResult = await chai.request(SERVER_APPLICATION_HOST).get(COMMANDS_URL + 'tags/' + invalidTag);

    expect(testResult.status).to.equal(404);

  });


  it('it should find by tag.', async () => {

    let result = await postCall(COMMANDS_ADMIN_URL, getCommandMock());

    result = await postCall(COMMANDS_ADMIN_URL, getCommandMock());

    expect(result.status).to.equal(201);

    let validTag = result.body.command.tags;

    let testResult = await chai.request(SERVER_APPLICATION_HOST).get(COMMANDS_URL + 'tags/' + validTag);

    expect(testResult.status).to.equal(200);
    expect(testResult.body.commands[0]).to.have.property('_id');
    expect(testResult.body.commands[0].tags).to.equal(validTag);
    expect(testResult.body.commands).to.have.lengthOf(2);
  });

});

async function postCall(url, body) {
  return chai.request(SERVER_APPLICATION_HOST).post(url).set('authorization', AUTHORIZATION_TOKEN).send(body);
}

async function patchCall(url, body) {
  return chai.request(SERVER_APPLICATION_HOST).patch(url).set('authorization', AUTHORIZATION_TOKEN).send(body);
}
