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

  /*

  describe('...', () => {

    beforeEach((done) => {
      User.deleteMany({}, (err) => {
        done();
      });
    });

    it('...', async () => {

      try {

        let res = await chai.request(SERVER_APPLICATION_HOST).get('/api/users/098');

        res.should.have.status(200);
        res.body.should.have.property('commands');
        res.body.commands.should.be.a('array');
        res.body.commands.length.should.be.eql(0);
      } catch (error) {
        console.error(error);
      }
    });
  });
  */
  // process.env.NODE_ENV = 'test';
  // const config = require('../../config/config');
  // const randomstring = require("randomstring");
  // let async = require('async');
  // let chai = require('chai');
  // let chaiHttp = require('chai-http');
  // let should = chai.should();
  // let User = require('./../../api/users/user');
  // chai.use(chaiHttp);
  // const server = require('../../server');

  // const Mockgoose = require('mockgoose').Mockgoose;
  // const mongoose = require('mongoose');

  // let mockgoose = new Mockgoose(mongoose);
  // mockgoose.helper.setDbVersion('3.2.1');
  // const SERVER_APPLICATION_HOST = 'http://localhost:8080';

  // const COMMAND_OBJECT_MOCK = {
  //   "title":"Executing a cucumber test through maven using an specif tag.",
  //   "command":"mvn test",
  //   "links":"",
  //   "userId":"5c48eada47227ff3460dce9b",
  //   "tags":"MAVEN"
  // }

  // const VALID_USER_MOCK = {
  //   'username': 'Jean Gray',
  //   'email': 'jean@mail.com',
  //   'password': '192837'
  //   }


  // before((done) => {
  //   mockgoose.prepareStorage()
  //     .then(() =>
  //       mongoose.connect(config.db.url, {useNewUrlParser: true}, done));
  // });

  // describe('Commands', () => {

  //   beforeEach((done) => {
  //     Command.deleteMany({}, (err) => {
  //          done();
  //       });
  //   });

  //   describe('/GET IT - commands by tag', () => {
  //     it('it should find any commands', (done) => {
  //       chai.request(SERVER_APPLICATION_HOST)
  //           .get('/api/tips/tags/test')
  //           .end((err, res) => {
  //                 res.should.have.status(200);
  //                 res.body.should.have.property('commands');
  //                 res.body.commands.should.be.a('array');
  //                 res.body.commands.length.should.be.eql(0);
  //             done();
  //           });
  //     });

  //     it('it should find any command by tag', (done) => {
  //       chai.request(SERVER_APPLICATION_HOST)
  //           .get('/api/tips/5c4f853e8f91855d711176f6')
  //           .then((res) => {
  //             res.should.have.status(404);
  //             done();
  //           })
  //           .catch((err) => {
  //             console.log('find by id error ' + err);
  //             done();
  //           })
  //     });

  //   });

  //   describe('/POST IT - create command', () => {

  //     it('it should return user not found error.', (done) => {
  //       chai.request(SERVER_APPLICATION_HOST)
  //           .post('/api/tips')
  //           .send(COMMAND_OBJECT_MOCK)
  //           .end((err, res) => {
  //                 res.should.have.status(400);
  //                 res.body.should.have.property('message').to.be.a('string', 'User not found.');
  //             done();
  //           });
  //     });

  //     it('it should create command.', function(done) {

  //       let tempCommand = COMMAND_OBJECT_MOCK;

  //       async.series([
  //           (cb) => {
  //             chai.request(SERVER_APPLICATION_HOST).post('/api/users').send(VALID_USER_MOCK).end((err, res) => {
  //               res.should.have.status(201);
  //                 //console.log('user created %j', res.body);
  //                 tempCommand.userId = res.body.user._id;
  //                 //console.log('temp commad %j', tempCommand);
  //                 return cb(null, tempCommand);
  //             })

  //           },
  //           (cb) => {
  //             //console.log('creating command %j', tempCommand);
  //             chai.request(SERVER_APPLICATION_HOST).post('/api/tips').send(tempCommand).end((err, res) => {
  //               //console.log('body %j', res.body);
  //               res.should.have.status(201);
  //               res.body.command.should.have.property('_id').to.be.a('string');
  //               return cb(null, tempCommand);
  //             });
  //           }
  //       ], done);
  //     });

  //   });

  //   describe('/POST IT - Query Command', () => {

  //     it('it should find command searching by title.', function(done) {

  //       let tempCommand = COMMAND_OBJECT_MOCK;

  //       async.series([
  //           (cb) => {
  //             VALID_USER_MOCK.email = VALID_USER_MOCK.email + randomstring.generate(5);
  //             chai.request(SERVER_APPLICATION_HOST).post('/api/users').send(VALID_USER_MOCK).end((err, res) => {
  //               //console.log('user created %j', res.body);
  //               res.should.have.status(201);
  //                 tempCommand.userId = res.body.user._id;
  //                 //console.log('temp commad %j', tempCommand);
  //                 return cb(null, tempCommand);
  //             })

  //           },
  //           (cb) => {
  //             tempCommand.title = tempCommand.title + randomstring.generate(5);
  //             //console.log('creating command %j', tempCommand);
  //             chai.request(SERVER_APPLICATION_HOST).post('/api/tips').send(tempCommand).end((err, res) => {
  //               //console.log('body %j', res.body);
  //               res.should.have.status(201);
  //               tempCommand = res.body;
  //               return cb(null, tempCommand);
  //             });
  //           },
  //           (cb) => {
  //             //console.log('creating command %j', tempCommand);
  //             chai.request(SERVER_APPLICATION_HOST).get('/api/tips/search/'+ tempCommand.command.title.substring(0,4)).send(tempCommand).end((err, res) => {
  //               //console.log('body %j', res.body);
  //               res.should.have.status(200);
  //               res.body.commands.should.not.be.empty;
  //               return cb(null, tempCommand);
  //             });
  //           }
  //       ], done);
  //     });

  //     it('it should find command searching by full description.', function(done) {

  //       let tempCommand = COMMAND_OBJECT_MOCK;
  //       let fullDescription = randomstring.generate();
  //       tempCommand.description = fullDescription;

  //       async.series([
  //           (cb) => {
  //             VALID_USER_MOCK.email = VALID_USER_MOCK.email + randomstring.generate(5);
  //             chai.request(SERVER_APPLICATION_HOST).post('/api/users').send(VALID_USER_MOCK).end((err, res) => {
  //               //console.log('user created %j', res.body);
  //               res.should.have.status(201);
  //                 tempCommand.userId = res.body.user._id;
  //                 //console.log('temp commad %j', tempCommand);
  //                 return cb(null, tempCommand);
  //             })

  //           },
  //           (cb) => {
  //             tempCommand.title = tempCommand.title + randomstring.generate(6);
  //             //console.log('creating command %j', tempCommand);
  //             chai.request(SERVER_APPLICATION_HOST).post('/api/tips').send(tempCommand).end((err, res) => {
  //               //console.log('body %j', res.body);
  //               res.should.have.status(201);
  //               tempCommand = res.body;
  //               return cb(null, tempCommand);
  //             });
  //           },
  //           (cb) => {
  //             //console.log('creating command %j', tempCommand);
  //             chai.request(SERVER_APPLICATION_HOST).get('/api/tips/search/'+ fullDescription.substring(0, 4)).send(tempCommand).end((err, res) => {
  //               if (err) {
  //                 console.error('error searching %j', err);
  //               }
  //               //console.log('body %j', res.body);
  //               res.should.have.status(200);
  //               res.body.commands.should.not.be.empty;
  //               return cb(null, tempCommand);
  //             });
  //           }
  //       ], done);
  //     });

  //     it('it should find command searching by command.', function(done) {

  //       let tempCommand = COMMAND_OBJECT_MOCK;
  //       let command = randomstring.generate();
  //       tempCommand.command = command;

  //       async.series([
  //           (cb) => {
  //             VALID_USER_MOCK.email = VALID_USER_MOCK.email + randomstring.generate(5);
  //             chai.request(SERVER_APPLICATION_HOST).post('/api/users').send(VALID_USER_MOCK).end((err, res) => {
  //               //console.log('user created %j', res.body);
  //               res.should.have.status(201);
  //                 tempCommand.userId = res.body.user._id;
  //                 //console.log('temp commad %j', tempCommand);
  //                 return cb(null, tempCommand);
  //             })

  //           },
  //           (cb) => {
  //             tempCommand.title = tempCommand.title + randomstring.generate(6);
  //             //console.log('creating command %j', tempCommand);
  //             chai.request(SERVER_APPLICATION_HOST).post('/api/tips').send(tempCommand).end((err, res) => {
  //               //console.log('body %j', res.body);
  //               res.should.have.status(201);
  //               tempCommand = res.body;
  //               return cb(null, tempCommand);
  //             });
  //           },
  //           (cb) => {
  //             //console.log('creating command %j', tempCommand);
  //             chai.request(SERVER_APPLICATION_HOST).get('/api/tips/search/' +
  //               command.substring(0, Math.floor(Math.random() * Math.floor(command.length)))).send(tempCommand).end((err, res) => {
  //               if (err) {
  //                 console.error('error searching %j', err);
  //               }
  //               //console.log('body %j', res.body);
  //               res.should.have.status(200);
  //               res.body.commands.should.not.be.empty;
  //               return cb(null, tempCommand);
  //             });
  //           }
  //       ], done);
  //     });

  //     it('it should not find command.', function(done) {

  //       let tempCommand = COMMAND_OBJECT_MOCK;

  //       async.series([
  //           (cb) => {
  //             VALID_USER_MOCK.email = VALID_USER_MOCK.email + randomstring.generate(5);
  //             chai.request(SERVER_APPLICATION_HOST).post('/api/users').send(VALID_USER_MOCK).end((err, res) => {
  //               //console.log('user created %j', res.body);
  //               res.should.have.status(201);
  //                 tempCommand.userId = res.body.user._id;
  //                 //console.log('temp commad %j', tempCommand);
  //                 return cb(null, tempCommand);
  //             })

  //           },
  //           (cb) => {
  //             tempCommand.title = tempCommand.title + randomstring.generate(5);
  //             //console.log('creating command %j', tempCommand);
  //             chai.request(SERVER_APPLICATION_HOST).post('/api/tips').send(tempCommand).end((err, res) => {
  //               //console.log('body %j', res.body);
  //               res.should.have.status(201);
  //               tempCommand = res.body;
  //               return cb(null, tempCommand);
  //             });
  //           },
  //           (cb) => {
  //             //console.log('creating command %j', tempCommand);
  //             let invalidDescribe = randomstring.generate();
  //             chai.request(SERVER_APPLICATION_HOST).get('/api/tips/search/'+ invalidDescribe).send(tempCommand).end((err, res) => {
  //               //console.log('seach body response %j', res.body);
  //               res.should.have.status(200);
  //               res.body.commands.should.be.empty;
  //               return cb(null, tempCommand);
  //             });
  //           }
  //       ], done);
  //     });
  //   });

  // });

  // describe('/PATCH IT - update command', () => {

  //   let invalidCommandId = '5c48eada47227ff3460dce9b';

  //   it('it should return command not found error.', (done) => {
  //     chai.request(SERVER_APPLICATION_HOST)
  //         .patch('/api/tips/' + invalidCommandId)
  //         .send(COMMAND_OBJECT_MOCK)
  //         .end((err, res) => {
  //               res.should.have.status(404);
  //               //console.log('response %j', res.body);
  //               res.body.message.should.equal('Command not found');
  //           done();
  //         });
  //   });

  //   it('it should update command.', function(done) {

  //     let tempCommand = COMMAND_OBJECT_MOCK;
  //     const value = randomstring.generate();

  //     async.series([
  //         (cb) => {
  //           VALID_USER_MOCK.email = VALID_USER_MOCK.email + randomstring.generate(5);
  //           chai.request(SERVER_APPLICATION_HOST).post('/api/users').send(VALID_USER_MOCK).end((err, res) => {
  //             //console.log('user created %j', res.body);
  //             res.should.have.status(201);
  //               tempCommand.userId = res.body.user._id;
  //               //console.log('temp commad %j', tempCommand);
  //               return cb(null, tempCommand);
  //           })
  //         },
  //         (cb) => {
  //           tempCommand.title = tempCommand.title + randomstring.generate(5);
  //           //console.log('creating command %j', tempCommand);
  //           chai.request(SERVER_APPLICATION_HOST).post('/api/tips').send(tempCommand).end((err, res) => {
  //             //console.log('body %j', res.body);
  //             res.should.have.status(201);
  //             tempCommand = res.body;
  //             return cb(null, tempCommand);
  //           });
  //         },
  //         (cb) => {
  //           //console.log('creating command %j', tempCommand);
  //           const attribute = 'command';
  //           const increment = false;

  //           tempCommand.increment = increment;
  //           tempCommand.attribute = attribute;
  //           tempCommand.value = value;

  //           chai.request(SERVER_APPLICATION_HOST)
  //             .patch('/api/tips/'+ tempCommand.command._id)
  //             .send(tempCommand).end((err, res) => {
  //               if (err) {
  //                 console.log('Error updating command %j.', tempCommand);
  //               }
  //               console.debug('seach body response %j', res.body);
  //               res.should.have.status(200);
  //               tempCommand = res.body.command;
  //               return cb(null, tempCommand);
  //           });
  //         },
  //         (cb) => {
  //           //console.log('id ' +tempCommand._id);
  //           chai.request(SERVER_APPLICATION_HOST).get('/api/tips/' + tempCommand._id).end((err, res) => {
  //             //console.log('user created %j', res.body);
  //             res.should.have.status(200);
  //             res.body.command.command.should.equal(value);
  //             return cb(null, tempCommand);
  //           })
  //         }
  //     ], done);
  //   });

  //    it('it should update command.', function(done) {

  //     let tempCommand = COMMAND_OBJECT_MOCK;
  //     const value = randomstring.generate();

  //     async.series([
  //         (cb) => {
  //           VALID_USER_MOCK.email = VALID_USER_MOCK.email + randomstring.generate(5);
  //           chai.request(SERVER_APPLICATION_HOST).post('/api/users').send(VALID_USER_MOCK).end((err, res) => {
  //             //console.log('user created %j', res.body);
  //             res.should.have.status(201);
  //               tempCommand.userId = res.body.user._id;
  //               //console.log('temp commad %j', tempCommand);
  //               return cb(null, tempCommand);
  //           })
  //         },
  //         (cb) => {
  //           tempCommand.title = tempCommand.title + randomstring.generate(5);
  //           //console.log('creating command %j', tempCommand);
  //           chai.request(SERVER_APPLICATION_HOST).post('/api/tips').send(tempCommand).end((err, res) => {
  //             //console.log('body %j', res.body);
  //             res.should.have.status(201);
  //             tempCommand = res.body;
  //             return cb(null, tempCommand);
  //           });
  //         },
  //         (cb) => {
  //           //console.log('creating command %j', tempCommand);
  //           const attribute = 'command';
  //           const increment = false;

  //           tempCommand.increment = increment;
  //           tempCommand.attribute = attribute;
  //           tempCommand.value = value;

  //           chai.request(SERVER_APPLICATION_HOST)
  //             .patch('/api/tips/'+ tempCommand.command._id)
  //             .send(tempCommand).end((err, res) => {
  //               if (err) {
  //                 console.log('Error updating command %j.', tempCommand);
  //               }
  //               console.debug('seach body response %j', res.body);
  //               res.should.have.status(200);
  //               tempCommand = res.body.command;
  //               return cb(null, tempCommand);
  //           });
  //         },
  //         (cb) => {
  //           //console.log('id ' +tempCommand._id);
  //           chai.request(SERVER_APPLICATION_HOST).get('/api/tips/' + tempCommand._id).end((err, res) => {
  //             //console.log('user created %j', res.body);
  //             res.should.have.status(200);
  //             res.body.command.command.should.equal(value);
  //             return cb(null, tempCommand);
  //           })
  //         }
  //     ], done);
  //   });

  //   it('it should increment command works.', function(done) {

  //     let tempCommand = COMMAND_OBJECT_MOCK;
  //     const value = randomstring.generate();

  //     async.series([
  //         (cb) => {
  //           VALID_USER_MOCK.email = VALID_USER_MOCK.email + randomstring.generate(5);
  //           chai.request(SERVER_APPLICATION_HOST).post('/api/users').send(VALID_USER_MOCK).end((err, res) => {
  //             //console.log('user created %j', res.body);
  //             res.should.have.status(201);
  //               tempCommand.userId = res.body.user._id;
  //               //console.log('temp commad %j', tempCommand);
  //               return cb(null, tempCommand);
  //           })
  //         },
  //         (cb) => {
  //           tempCommand.title = tempCommand.title + randomstring.generate(5);
  //           //console.log('creating command %j', tempCommand);
  //           chai.request(SERVER_APPLICATION_HOST).post('/api/tips').send(tempCommand).end((err, res) => {
  //             //console.log('body %j', res.body);
  //             res.should.have.status(201);
  //             tempCommand = res.body;
  //             return cb(null, tempCommand);
  //           });
  //         },
  //         (cb) => {
  //           //console.log('creating command %j', tempCommand);
  //           const attribute = 'works';
  //           const increment = true;

  //           tempCommand.increment = increment;
  //           tempCommand.attribute = attribute;

  //           chai.request(SERVER_APPLICATION_HOST)
  //             .patch('/api/tips/'+ tempCommand.command._id)
  //             .send(tempCommand).end((err, res) => {
  //               if (err) {
  //                 console.log('Error updating command %j.', tempCommand);
  //               }
  //               console.debug('seach body response %j', res.body);
  //               res.should.have.status(200);
  //               tempCommand = res.body.command;
  //               return cb(null, tempCommand);
  //           });
  //         },
  //         (cb) => {
  //           //console.log('id ' +tempCommand._id);
  //           chai.request(SERVER_APPLICATION_HOST).get('/api/tips/' + tempCommand._id).end((err, res) => {
  //             //console.log('user created %j', res.body);
  //             res.should.have.status(200);
  //             res.body.command.works.should.be.equal(1);
  //             return cb(null, tempCommand);
  //           })
  //         }
  //     ], done);
  //   });

  //   it('it should increment command does not works.', function(done) {

  //     let tempCommand = COMMAND_OBJECT_MOCK;

  //     async.series([
  //         (cb) => {
  //           VALID_USER_MOCK.email = VALID_USER_MOCK.email + randomstring.generate(5);
  //           chai.request(SERVER_APPLICATION_HOST).post('/api/users').send(VALID_USER_MOCK).end((err, res) => {
  //             //console.log('user created %j', res.body);
  //             res.should.have.status(201);
  //               tempCommand.userId = res.body.user._id;
  //               //console.log('temp commad %j', tempCommand);
  //               return cb(null, tempCommand);
  //           })
  //         },
  //         (cb) => {
  //           tempCommand.title = tempCommand.title + randomstring.generate(5);
  //           //console.log('creating command %j', tempCommand);
  //           chai.request(SERVER_APPLICATION_HOST).post('/api/tips').send(tempCommand).end((err, res) => {
  //             //console.log('body %j', res.body);
  //             res.should.have.status(201);
  //             tempCommand = res.body;
  //             return cb(null, tempCommand);
  //           });
  //         },
  //         (cb) => {
  //           //console.log('creating command %j', tempCommand);
  //           const attribute = 'doesnt_work';
  //           const increment = true;

  //           tempCommand.increment = increment;
  //           tempCommand.attribute = attribute;

  //           chai.request(SERVER_APPLICATION_HOST)
  //             .patch('/api/tips/'+ tempCommand.command._id)
  //             .send(tempCommand).end((err, res) => {
  //               if (err) {
  //                 console.log('Error updating command %j.', tempCommand);
  //               }
  //               console.debug('seach body response %j', res.body);
  //               res.should.have.status(200);
  //               tempCommand = res.body.command;
  //               return cb(null, tempCommand);
  //           });
  //         },
  //         (cb) => {
  //           //console.log('id ' +tempCommand._id);
  //           chai.request(SERVER_APPLICATION_HOST).get('/api/tips/' + tempCommand._id).end((err, res) => {
  //             //console.log('user created %j', res.body);
  //             res.should.have.status(200);
  //             res.body.command.doesnt_work.should.be.equal(1);
  //             return cb(null, tempCommand);
  //           })
  //         }
  //     ], done);
  //   });

});
