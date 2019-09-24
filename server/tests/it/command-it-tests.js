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

    //console.log('%j', testResult.body);

    testResult.status.should.equal(200);

    testResult.body.commands[0].should.have.property('_id');

    testResult.body.commands[0].tags.should.equal(validTag);

    testResult.body.commands.length.should.equal(2);

  });


  /*
    it('it should find any commands', (done) => {
      chai.request(SERVER_APPLICATION_HOST)
          .get('/api/tips/tags/test')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('commands');
                res.body.commands.should.be.a('array');
                res.body.commands.length.should.be.eql(0);
            done();
          });
    });

    it('it should find any command by tag', (done) => {
      chai.request(SERVER_APPLICATION_HOST)
          .get('/api/tips/5c4f853e8f91855d711176f6')
          .then((res) => {
            res.should.have.status(404);
            done();
          })
          .catch((err) => {
            console.log('find by id error ' + err);
            done();
          })
    });
*/
});
/*
  describe('/POST IT - create command', () => {

    it('it should return user not found error.', (done) => {
      chai.request(SERVER_APPLICATION_HOST)
          .post('/api/tips')
          .send(COMMAND_OBJECT_MOCK)
          .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('message').to.be.a('string', 'User not found.');
            done();
          });
    });

    it('it should create command.', function(done) {

      let tempCommand = COMMAND_OBJECT_MOCK;

      async.series([
          (cb) => {
            chai.request(SERVER_APPLICATION_HOST).post('/api/users').send(VALID_USER_MOCK).end((err, res) => {
              res.should.have.status(201);
                //console.log('user created %j', res.body);
                tempCommand.userId = res.body.user._id;
                //console.log('temp commad %j', tempCommand);
                return cb(null, tempCommand);
            })

          },
          (cb) => {
            //console.log('creating command %j', tempCommand);
            chai.request(SERVER_APPLICATION_HOST).post('/api/tips').send(tempCommand).end((err, res) => {
              //console.log('body %j', res.body);
              res.should.have.status(201);
              res.body.command.should.have.property('_id').to.be.a('string');
              return cb(null, tempCommand);
            });
          }
      ], done);
    });

  });

  describe('/POST IT - Query Command', () => {

    it('it should find command searching by title.', function(done) {

      let tempCommand = COMMAND_OBJECT_MOCK;

      async.series([
          (cb) => {
            VALID_USER_MOCK.email = VALID_USER_MOCK.email + randomstring.generate(5);
            chai.request(SERVER_APPLICATION_HOST).post('/api/users').send(VALID_USER_MOCK).end((err, res) => {
              //console.log('user created %j', res.body);
              res.should.have.status(201);
                tempCommand.userId = res.body.user._id;
                //console.log('temp commad %j', tempCommand);
                return cb(null, tempCommand);
            })

          },
          (cb) => {
            tempCommand.title = tempCommand.title + randomstring.generate(5);
            //console.log('creating command %j', tempCommand);
            chai.request(SERVER_APPLICATION_HOST).post('/api/tips').send(tempCommand).end((err, res) => {
              //console.log('body %j', res.body);
              res.should.have.status(201);
              tempCommand = res.body;
              return cb(null, tempCommand);
            });
          },
          (cb) => {
            //console.log('creating command %j', tempCommand);
            chai.request(SERVER_APPLICATION_HOST).get('/api/tips/search/'+ tempCommand.command.title.substring(0,4)).send(tempCommand).end((err, res) => {
              //console.log('body %j', res.body);
              res.should.have.status(200);
              res.body.commands.should.not.be.empty;
              return cb(null, tempCommand);
            });
          }
      ], done);
    });

    it('it should find command searching by full description.', function(done) {

      let tempCommand = COMMAND_OBJECT_MOCK;
      let fullDescription = randomstring.generate();
      tempCommand.description = fullDescription;

      async.series([
          (cb) => {
            VALID_USER_MOCK.email = VALID_USER_MOCK.email + randomstring.generate(5);
            chai.request(SERVER_APPLICATION_HOST).post('/api/users').send(VALID_USER_MOCK).end((err, res) => {
              //console.log('user created %j', res.body);
              res.should.have.status(201);
                tempCommand.userId = res.body.user._id;
                //console.log('temp commad %j', tempCommand);
                return cb(null, tempCommand);
            })

          },
          (cb) => {
            tempCommand.title = tempCommand.title + randomstring.generate(6);
            //console.log('creating command %j', tempCommand);
            chai.request(SERVER_APPLICATION_HOST).post('/api/tips').send(tempCommand).end((err, res) => {
              //console.log('body %j', res.body);
              res.should.have.status(201);
              tempCommand = res.body;
              return cb(null, tempCommand);
            });
          },
          (cb) => {
            //console.log('creating command %j', tempCommand);
            chai.request(SERVER_APPLICATION_HOST).get('/api/tips/search/'+ fullDescription.substring(0, 4)).send(tempCommand).end((err, res) => {
              if (err) {
                console.error('error searching %j', err);
              }
              //console.log('body %j', res.body);
              res.should.have.status(200);
              res.body.commands.should.not.be.empty;
              return cb(null, tempCommand);
            });
          }
      ], done);
    });

    it('it should find command searching by command.', function(done) {

      let tempCommand = COMMAND_OBJECT_MOCK;
      let command = randomstring.generate();
      tempCommand.command = command;

      async.series([
          (cb) => {
            VALID_USER_MOCK.email = VALID_USER_MOCK.email + randomstring.generate(5);
            chai.request(SERVER_APPLICATION_HOST).post('/api/users').send(VALID_USER_MOCK).end((err, res) => {
              //console.log('user created %j', res.body);
              res.should.have.status(201);
                tempCommand.userId = res.body.user._id;
                //console.log('temp commad %j', tempCommand);
                return cb(null, tempCommand);
            })

          },
          (cb) => {
            tempCommand.title = tempCommand.title + randomstring.generate(6);
            //console.log('creating command %j', tempCommand);
            chai.request(SERVER_APPLICATION_HOST).post('/api/tips').send(tempCommand).end((err, res) => {
              //console.log('body %j', res.body);
              res.should.have.status(201);
              tempCommand = res.body;
              return cb(null, tempCommand);
            });
          },
          (cb) => {
            //console.log('creating command %j', tempCommand);
            chai.request(SERVER_APPLICATION_HOST).get('/api/tips/search/' +
              command.substring(0, Math.floor(Math.random() * Math.floor(command.length)))).send(tempCommand).end((err, res) => {
              if (err) {
                console.error('error searching %j', err);
              }
              //console.log('body %j', res.body);
              res.should.have.status(200);
              res.body.commands.should.not.be.empty;
              return cb(null, tempCommand);
            });
          }
      ], done);
    });

    it('it should not find command.', function(done) {

      let tempCommand = COMMAND_OBJECT_MOCK;

      async.series([
          (cb) => {
            VALID_USER_MOCK.email = VALID_USER_MOCK.email + randomstring.generate(5);
            chai.request(SERVER_APPLICATION_HOST).post('/api/users').send(VALID_USER_MOCK).end((err, res) => {
              //console.log('user created %j', res.body);
              res.should.have.status(201);
                tempCommand.userId = res.body.user._id;
                //console.log('temp commad %j', tempCommand);
                return cb(null, tempCommand);
            })

          },
          (cb) => {
            tempCommand.title = tempCommand.title + randomstring.generate(5);
            //console.log('creating command %j', tempCommand);
            chai.request(SERVER_APPLICATION_HOST).post('/api/tips').send(tempCommand).end((err, res) => {
              //console.log('body %j', res.body);
              res.should.have.status(201);
              tempCommand = res.body;
              return cb(null, tempCommand);
            });
          },
          (cb) => {
            //console.log('creating command %j', tempCommand);
            let invalidDescribe = randomstring.generate();
            chai.request(SERVER_APPLICATION_HOST).get('/api/tips/search/'+ invalidDescribe).send(tempCommand).end((err, res) => {
              //console.log('seach body response %j', res.body);
              res.should.have.status(200);
              res.body.commands.should.be.empty;
              return cb(null, tempCommand);
            });
          }
      ], done);
    });
  });

});

describe('/PATCH IT - update command', () => {

  let invalidCommandId = '5c48eada47227ff3460dce9b';

  it('it should return command not found error.', (done) => {
    chai.request(SERVER_APPLICATION_HOST)
        .patch('/api/tips/' + invalidCommandId)
        .send(COMMAND_OBJECT_MOCK)
        .end((err, res) => {
              res.should.have.status(404);
              //console.log('response %j', res.body);
              res.body.message.should.equal('Command not found');
          done();
        });
  });

  it('it should update command.', function(done) {

    let tempCommand = COMMAND_OBJECT_MOCK;
    const value = randomstring.generate();

    async.series([
        (cb) => {
          VALID_USER_MOCK.email = VALID_USER_MOCK.email + randomstring.generate(5);
          chai.request(SERVER_APPLICATION_HOST).post('/api/users').send(VALID_USER_MOCK).end((err, res) => {
            //console.log('user created %j', res.body);
            res.should.have.status(201);
              tempCommand.userId = res.body.user._id;
              //console.log('temp commad %j', tempCommand);
              return cb(null, tempCommand);
          })
        },
        (cb) => {
          tempCommand.title = tempCommand.title + randomstring.generate(5);
          //console.log('creating command %j', tempCommand);
          chai.request(SERVER_APPLICATION_HOST).post('/api/tips').send(tempCommand).end((err, res) => {
            //console.log('body %j', res.body);
            res.should.have.status(201);
            tempCommand = res.body;
            return cb(null, tempCommand);
          });
        },
        (cb) => {
          //console.log('creating command %j', tempCommand);
          const attribute = 'command';
          const increment = false;

          tempCommand.increment = increment;
          tempCommand.attribute = attribute;
          tempCommand.value = value;

          chai.request(SERVER_APPLICATION_HOST)
            .patch('/api/tips/'+ tempCommand.command._id)
            .send(tempCommand).end((err, res) => {
              if (err) {
                console.log('Error updating command %j.', tempCommand);
              }
              console.debug('seach body response %j', res.body);
              res.should.have.status(200);
              tempCommand = res.body.command;
              return cb(null, tempCommand);
          });
        },
        (cb) => {
          //console.log('id ' +tempCommand._id);
          chai.request(SERVER_APPLICATION_HOST).get('/api/tips/' + tempCommand._id).end((err, res) => {
            //console.log('user created %j', res.body);
            res.should.have.status(200);
            res.body.command.command.should.equal(value);
            return cb(null, tempCommand);
          })
        }
    ], done);
  });

   it('it should update command.', function(done) {

    let tempCommand = COMMAND_OBJECT_MOCK;
    const value = randomstring.generate();

    async.series([
        (cb) => {
          VALID_USER_MOCK.email = VALID_USER_MOCK.email + randomstring.generate(5);
          chai.request(SERVER_APPLICATION_HOST).post('/api/users').send(VALID_USER_MOCK).end((err, res) => {
            //console.log('user created %j', res.body);
            res.should.have.status(201);
              tempCommand.userId = res.body.user._id;
              //console.log('temp commad %j', tempCommand);
              return cb(null, tempCommand);
          })
        },
        (cb) => {
          tempCommand.title = tempCommand.title + randomstring.generate(5);
          //console.log('creating command %j', tempCommand);
          chai.request(SERVER_APPLICATION_HOST).post('/api/tips').send(tempCommand).end((err, res) => {
            //console.log('body %j', res.body);
            res.should.have.status(201);
            tempCommand = res.body;
            return cb(null, tempCommand);
          });
        },
        (cb) => {
          //console.log('creating command %j', tempCommand);
          const attribute = 'command';
          const increment = false;

          tempCommand.increment = increment;
          tempCommand.attribute = attribute;
          tempCommand.value = value;

          chai.request(SERVER_APPLICATION_HOST)
            .patch('/api/tips/'+ tempCommand.command._id)
            .send(tempCommand).end((err, res) => {
              if (err) {
                console.log('Error updating command %j.', tempCommand);
              }
              console.debug('seach body response %j', res.body);
              res.should.have.status(200);
              tempCommand = res.body.command;
              return cb(null, tempCommand);
          });
        },
        (cb) => {
          //console.log('id ' +tempCommand._id);
          chai.request(SERVER_APPLICATION_HOST).get('/api/tips/' + tempCommand._id).end((err, res) => {
            //console.log('user created %j', res.body);
            res.should.have.status(200);
            res.body.command.command.should.equal(value);
            return cb(null, tempCommand);
          })
        }
    ], done);
  });

  it('it should increment command works.', function(done) {

    let tempCommand = COMMAND_OBJECT_MOCK;
    const value = randomstring.generate();

    async.series([
        (cb) => {
          VALID_USER_MOCK.email = VALID_USER_MOCK.email + randomstring.generate(5);
          chai.request(SERVER_APPLICATION_HOST).post('/api/users').send(VALID_USER_MOCK).end((err, res) => {
            //console.log('user created %j', res.body);
            res.should.have.status(201);
              tempCommand.userId = res.body.user._id;
              //console.log('temp commad %j', tempCommand);
              return cb(null, tempCommand);
          })
        },
        (cb) => {
          tempCommand.title = tempCommand.title + randomstring.generate(5);
          //console.log('creating command %j', tempCommand);
          chai.request(SERVER_APPLICATION_HOST).post('/api/tips').send(tempCommand).end((err, res) => {
            //console.log('body %j', res.body);
            res.should.have.status(201);
            tempCommand = res.body;
            return cb(null, tempCommand);
          });
        },
        (cb) => {
          //console.log('creating command %j', tempCommand);
          const attribute = 'works';
          const increment = true;

          tempCommand.increment = increment;
          tempCommand.attribute = attribute;

          chai.request(SERVER_APPLICATION_HOST)
            .patch('/api/tips/'+ tempCommand.command._id)
            .send(tempCommand).end((err, res) => {
              if (err) {
                console.log('Error updating command %j.', tempCommand);
              }
              console.debug('seach body response %j', res.body);
              res.should.have.status(200);
              tempCommand = res.body.command;
              return cb(null, tempCommand);
          });
        },
        (cb) => {
          //console.log('id ' +tempCommand._id);
          chai.request(SERVER_APPLICATION_HOST).get('/api/tips/' + tempCommand._id).end((err, res) => {
            //console.log('user created %j', res.body);
            res.should.have.status(200);
            res.body.command.works.should.be.equal(1);
            return cb(null, tempCommand);
          })
        }
    ], done);
  });

  it('it should increment command does not works.', function(done) {

    let tempCommand = COMMAND_OBJECT_MOCK;

    async.series([
        (cb) => {
          VALID_USER_MOCK.email = VALID_USER_MOCK.email + randomstring.generate(5);
          chai.request(SERVER_APPLICATION_HOST).post('/api/users').send(VALID_USER_MOCK).end((err, res) => {
            //console.log('user created %j', res.body);
            res.should.have.status(201);
              tempCommand.userId = res.body.user._id;
              //console.log('temp commad %j', tempCommand);
              return cb(null, tempCommand);
          })
        },
        (cb) => {
          tempCommand.title = tempCommand.title + randomstring.generate(5);
          //console.log('creating command %j', tempCommand);
          chai.request(SERVER_APPLICATION_HOST).post('/api/tips').send(tempCommand).end((err, res) => {
            //console.log('body %j', res.body);
            res.should.have.status(201);
            tempCommand = res.body;
            return cb(null, tempCommand);
          });
        },
        (cb) => {
          //console.log('creating command %j', tempCommand);
          const attribute = 'doesnt_work';
          const increment = true;

          tempCommand.increment = increment;
          tempCommand.attribute = attribute;

          chai.request(SERVER_APPLICATION_HOST)
            .patch('/api/tips/'+ tempCommand.command._id)
            .send(tempCommand).end((err, res) => {
              if (err) {
                console.log('Error updating command %j.', tempCommand);
              }
              console.debug('seach body response %j', res.body);
              res.should.have.status(200);
              tempCommand = res.body.command;
              return cb(null, tempCommand);
          });
        },
        (cb) => {
          //console.log('id ' +tempCommand._id);
          chai.request(SERVER_APPLICATION_HOST).get('/api/tips/' + tempCommand._id).end((err, res) => {
            //console.log('user created %j', res.body);
            res.should.have.status(200);
            res.body.command.doesnt_work.should.be.equal(1);
            return cb(null, tempCommand);
          })
        }
    ], done);
  });

});
*/
