process.env.NODE_ENV = 'test';
const assert = require("assert");
const mongoose = require('mongoose');
const config = require('../../config/config');
let chai = require('chai');
let chaiHttp = require('chai-http');
let User = require('./../../api/users/user');
const server = require('../../server');
//const DB = require('mongoose').Db;
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;

chai.use(chaiHttp);
let mongoServer;
let con;
let db;

const expect = chai.expect;

const SERVER_APPLICATION_HOST = 'http://localhost:8080';
const USER_ID = '5c48eada47227ff3460dce9b';
const USER_URL = '/api/users/';
const USER_ADMIN_URL = '/admin/api/users/';
const AUTHORIZATION_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

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

    var result = await chai.request(SERVER_APPLICATION_HOST).get(USER_URL + USER_ID);

    expect(result.status).to.equal(404);

  });

  it('it should create an user.', async () => {

    try {

      var result = await postCall(USER_ADMIN_URL, VALID_USER_MOCK);

      expect(result.status).to.equal(201);
      expect(result.body.user).to.have.property('email');
      expect(result.body.user).to.have.property('_id');

    } catch (err) {
      assert.fail(err.message);
    }
  });

  it('invalid user should return bad request error.', async () => {

    try {

      let tempUser = VALID_USER_MOCK;
      delete tempUser.email;

      var result = await postCall(USER_ADMIN_URL, tempUser);

      expect(result.status).to.equal(400);

    } catch (err) {
      assert.fail(err.message);
    }
  });

  it('repeated email given should return bad request error.', async () => {

    try {

      var result = await postCall(USER_ADMIN_URL, createTestUser());

      expect(result.status).to.equal(201);

      result = await postCall(USER_ADMIN_URL, createTestUser());

      expect(result.status).to.equal(400);

    } catch (err) {
      assert.fail(err.message);
    }
  });

  it('update user not existent user given.', async () => {

    try {

      var result = await putCall(USER_ADMIN_URL + USER_ID, createTestUser());

      expect(result.status).to.equal(404);

    } catch (err) {
      assert.fail(err.message);
    }
  });


  it('update user invalid should return bad request.', async () => {

    try {

      let result = await postCall(USER_ADMIN_URL, createTestUser());

      expect(result.status).to.equal(201);

      let userId = result.body.user._id;
      //console.log('user id ' + userId);
      let tempUser = createTestUser();
      delete tempUser.email;

      result = await putCall(USER_ADMIN_URL + userId, tempUser);

      expect(result.status).to.equal(400);

    } catch (err) {
      assert.fail(err.message);
    }
  });

  it('Valid user should update user.', async () => {

    try {

      let user = createTestUser();

      let result = await postCall(USER_ADMIN_URL, user);

      expect(result.status).to.equal(201);

      let userId = result.body.user._id;

      user.username = 'new user name';

      result = await putCall(USER_ADMIN_URL + userId, user);

      expect(result.status).to.equal(200);
      expect(result.body.user).to.have.property('email');        

    } catch (err) {
      assert.fail(err.message);
    }
  });

  it('Repeated email given not update user.', async () => {

    try {

      let user = createTestUser();

      let result = await postCall(USER_ADMIN_URL, user);

      let userTwo = createTestUser();
      userTwo.email = userTwo.email + 'br';

      let resultTwo = await postCall(USER_ADMIN_URL, userTwo);

      expect(resultTwo.status).to.equal(201);

      let userIdTwo = resultTwo.body.user._id;

      userTwo.email = user.email;

      result = await putCall(USER_ADMIN_URL + userIdTwo, userTwo);

      expect(result.status).to.equal(400);

    } catch (err) {
      assert.fail(err.message);
    }
  });

  it('create user not token given should return unauthorized error.', async () => {  

    let result = await chai.request(SERVER_APPLICATION_HOST).post(USER_ADMIN_URL).send(createTestUser());

    expect(result.status).to.equal(401);    

  });

  it('update user not token given should return unauthorized error.', async () => {  

    let result = await chai.request(SERVER_APPLICATION_HOST).put(USER_ADMIN_URL).send(createTestUser());

    expect(result.status).to.equal(401);    

  });

});

async function postCall(url, body) {
  return chai.request(SERVER_APPLICATION_HOST).post(url).set('authorization', AUTHORIZATION_TOKEN).send(body);
}

async function putCall(url, body) {
  return chai.request(SERVER_APPLICATION_HOST).put(url).set('authorization', AUTHORIZATION_TOKEN).send(body);
}