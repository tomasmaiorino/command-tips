process.env.NODE_ENV = 'test';
const assert = require("assert");
const mongoose = require('mongoose');
//const DB = require('mongoose').Db;
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const config = require('../../config/config');
const SERVER_APPLICATION_HOST = 'http://localhost:8080';
let chai = require('chai');
let chaiHttp = require('chai-http');
let User = require('./../../api/users/user');
chai.use(chaiHttp);
let mongoServer;
let con;
let db;
const server = require('../../server');
const expect = chai.expect;
var should = require('chai').should()
const USER_ID = '5c48eada47227ff3460dce9b';

function createTestUser() {
  return {
    'username': 'Jean Gray',
    'email': 'jean@mail.com',
    'password': '192837'
  }
}

const VALID_USER_MOCK = {
  'username': 'Jean Gray',
  'email': 'jean@mail.com',
  'password': '192837'
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

describe('Users ', () => {

  beforeEach((done) => {
    User.deleteMany({}, function (err) { });
    done();
  });

  it('it should not find user by id.', async () => {

    var result = await chai.request(SERVER_APPLICATION_HOST).get('/api/users/' + USER_ID);

    result.status.should.equal(404);
  });

  it('it should create an user.', async () => {

    try {

      var result = await chai.request(SERVER_APPLICATION_HOST).post('/api/users/').send(VALID_USER_MOCK);

      expect(result.status).to.equal(201);
      result.body.user.should.have.property('email');
      result.body.user.should.have.property('_id');

    } catch (err) {
      assert.fail(err.message);
    }
  });

  it('invalid user should return bad request error.', async () => {

    try {

      let tempUser = VALID_USER_MOCK;
      delete tempUser.email;

      var result = await chai.request(SERVER_APPLICATION_HOST).post('/api/users/').send(tempUser);

      expect(result.status).to.equal(400);

    } catch (err) {
      assert.fail(err.message);
    }
  });

  it('repeated email given should return bad request error.', async () => {

    try {

      var result = await chai.request(SERVER_APPLICATION_HOST).post('/api/users/').send(createTestUser());

      expect(result.status).to.equal(201);

      result = await chai.request(SERVER_APPLICATION_HOST).post('/api/users/').send(createTestUser());

      expect(result.status).to.equal(400);

    } catch (err) {
      assert.fail(err.message);
    }
  });

  it('update user not existent user given.', async () => {

    try {

      var result = await chai.request(SERVER_APPLICATION_HOST).put('/api/users/' + USER_ID).send(createTestUser());

      expect(result.status).to.equal(404);

    } catch (err) {
      assert.fail(err.message);
    }
  });


  it('update user invalid should return bad request.', async () => {

    try {

      let result = await chai.request(SERVER_APPLICATION_HOST).post('/api/users/').send(createTestUser());

      expect(result.status).to.equal(201);

      let userId = result.body.user._id;
      //console.log('user id ' + userId);
      let tempUser = createTestUser();
      delete tempUser.email;

      result = await chai.request(SERVER_APPLICATION_HOST).put('/api/users/' + userId).send(tempUser);

      expect(result.status).to.equal(400);

    } catch (err) {
      assert.fail(err.message);
    }
  });

  it('Valid user should update user.', async () => {

    try {

      let user = createTestUser();

      let result = await chai.request(SERVER_APPLICATION_HOST).post('/api/users/').send(user);

      expect(result.status).to.equal(201);

      let userId = result.body.user._id;

      user.username = 'new user name';

      result = await chai.request(SERVER_APPLICATION_HOST).put('/api/users/' + userId).send(user);

      expect(result.status).to.equal(200);
      
      result.body.user.should.have.property('email');

    } catch (err) {
      assert.fail(err.message);
    }
  });

  it('Repeated email given not update user.', async () => {

    try {

      let user = createTestUser();

      let result = await chai.request(SERVER_APPLICATION_HOST).post('/api/users/').send(user);

      let userTwo = createTestUser();
      userTwo.email = userTwo.email + 'br';

      let resultTwo = await chai.request(SERVER_APPLICATION_HOST).post('/api/users/').send(userTwo);

      expect(resultTwo.status).to.equal(201);

      let userIdTwo = resultTwo.body.user._id;

      userTwo.email = user.email;

      result = await chai.request(SERVER_APPLICATION_HOST).put('/api/users/' + userIdTwo).send(userTwo);

      expect(result.status).to.equal(400);

    } catch (err) {
      assert.fail(err.message);
    }
  });

});
