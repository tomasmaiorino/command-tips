process.env.NODE_ENV = 'test';
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
  return {
    "name": "Executing a cucumber test through maven using an specif tag.",
    "techs": ['mvn','test'],
    "roles": ['mvn', 'test'],
    "description": ['description'],
    "achievements": ['achi', 'achi']
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

describe('Project POST', () => {

  it('invalid project given should return bad request with error message.', async () => {

    let tempProject = getProjectMock();
    delete tempProject.name;

    let result = await chai.request(SERVER_APPLICATION_HOST).post(PROJECTS_URL).send(tempProject);

    //console.log('%j', result.body);

    result.body.errors.should.have.property('name');

    result.status.should.equal(400);

  });

  it('valid project given should return created response.', async () => {

    let tempProject = getProjectMock();;

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
/*
describe('Commands QUERY', () => {

  beforeEach((done) => {
    Project.deleteMany({}, (err) => {
      done();
    });
  });

  it('not valid query given should return empty projects array.', async () => {

    let setUpResult = await chai.request(SERVER_APPLICATION_HOST).post(PROJECTS_URL).send(COMMAND_OBJECT_MOCK);

    setUpResult.status.should.equal(201);

    let query = 'query';

    let testResult = await chai.request(SERVER_APPLICATION_HOST).get(PROJECTS_URL + 'search/' + query);

    testResult.status.should.equal(200);

    testResult.body.projects.length.should.equal(0);

  });

  it('valid query by project given should return empty projects array.', async () => {

    let setUpResult = await chai.request(SERVER_APPLICATION_HOST).post(PROJECTS_URL).send(COMMAND_OBJECT_MOCK);

    setUpResult.status.should.equal(201);

    let query = setUpResult.body.project.project.substring(0, 4);

    let testResult = await chai.request(SERVER_APPLICATION_HOST).get(PROJECTS_URL + 'search/' + query);

    testResult.status.should.equal(200);

    testResult.body.projects.length.should.equal(1);

  });

});

describe('Commands TAGS', () => {

  beforeEach((done) => {
    Project.deleteMany({}, (err) => {
      done();
    });
  });

  it('it should not find by tag.', async () => {

    let setUpResult = await chai.request(SERVER_APPLICATION_HOST).post(PROJECTS_URL).send(COMMAND_OBJECT_MOCK);

    setUpResult.status.should.equal(201);

    let invalidTag = 'invalid';

    let testResult = await chai.request(SERVER_APPLICATION_HOST).get(PROJECTS_URL + 'tags/' + invalidTag);

    testResult.status.should.equal(404);

  });


  it('it should find by tag.', async () => {

    let result = await chai.request(SERVER_APPLICATION_HOST).post(PROJECTS_URL).send(COMMAND_OBJECT_MOCK);

    result = await chai.request(SERVER_APPLICATION_HOST).post(PROJECTS_URL).send(COMMAND_OBJECT_MOCK);

    result.status.should.equal(201);

    let validTag = result.body.project.tags;

    let testResult = await chai.request(SERVER_APPLICATION_HOST).get(PROJECTS_URL + 'tags/' + validTag);

    //console.log('%j', testResult.body);

    testResult.status.should.equal(200);

    testResult.body.projects[0].should.have.property('_id');

    testResult.body.projects[0].tags.should.equal(validTag);

    testResult.body.projects.length.should.equal(2);

  });
});
*/
  /*
    it('it should find any projects', (done) => {
      chai.request(SERVER_APPLICATION_HOST)
          .get('/api/tips/tags/test')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('projects');
                res.body.projects.should.be.a('array');
                res.body.projects.length.should.be.eql(0);
            done();
          });
    });

    it('it should find any project by tag', (done) => {
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

/*
  describe('/POST IT - create project', () => {

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

    it('it should create project.', function(done) {

      let tempProject = COMMAND_OBJECT_MOCK;

      async.series([
          (cb) => {
            chai.request(SERVER_APPLICATION_HOST).post('/api/users').send(VALID_USER_MOCK).end((err, res) => {
              res.should.have.status(201);
                //console.log('user created %j', res.body);
                tempProject.userId = res.body.user._id;
                //console.log('temp commad %j', tempProject);
                return cb(null, tempProject);
            })

          },
          (cb) => {
            //console.log('creating project %j', tempProject);
            chai.request(SERVER_APPLICATION_HOST).post('/api/tips').send(tempProject).end((err, res) => {
              //console.log('body %j', res.body);
              res.should.have.status(201);
              res.body.project.should.have.property('_id').to.be.a('string');
              return cb(null, tempProject);
            });
          }
      ], done);
    });

  });

  describe('/POST IT - Query Project', () => {

    it('it should find project searching by title.', function(done) {

      let tempProject = COMMAND_OBJECT_MOCK;

      async.series([
          (cb) => {
            VALID_USER_MOCK.email = VALID_USER_MOCK.email + randomstring.generate(5);
            chai.request(SERVER_APPLICATION_HOST).post('/api/users').send(VALID_USER_MOCK).end((err, res) => {
              //console.log('user created %j', res.body);
              res.should.have.status(201);
                tempProject.userId = res.body.user._id;
                //console.log('temp commad %j', tempProject);
                return cb(null, tempProject);
            })

          },
          (cb) => {
            tempProject.title = tempProject.title + randomstring.generate(5);
            //console.log('creating project %j', tempProject);
            chai.request(SERVER_APPLICATION_HOST).post('/api/tips').send(tempProject).end((err, res) => {
              //console.log('body %j', res.body);
              res.should.have.status(201);
              tempProject = res.body;
              return cb(null, tempProject);
            });
          },
          (cb) => {
            //console.log('creating project %j', tempProject);
            chai.request(SERVER_APPLICATION_HOST).get('/api/tips/search/'+ tempProject.project.title.substring(0,4)).send(tempProject).end((err, res) => {
              //console.log('body %j', res.body);
              res.should.have.status(200);
              res.body.projects.should.not.be.empty;
              return cb(null, tempProject);
            });
          }
      ], done);
    });

    it('it should find project searching by full description.', function(done) {

      let tempProject = COMMAND_OBJECT_MOCK;
      let fullDescription = randomstring.generate();
      tempProject.description = fullDescription;

      async.series([
          (cb) => {
            VALID_USER_MOCK.email = VALID_USER_MOCK.email + randomstring.generate(5);
            chai.request(SERVER_APPLICATION_HOST).post('/api/users').send(VALID_USER_MOCK).end((err, res) => {
              //console.log('user created %j', res.body);
              res.should.have.status(201);
                tempProject.userId = res.body.user._id;
                //console.log('temp commad %j', tempProject);
                return cb(null, tempProject);
            })

          },
          (cb) => {
            tempProject.title = tempProject.title + randomstring.generate(6);
            //console.log('creating project %j', tempProject);
            chai.request(SERVER_APPLICATION_HOST).post('/api/tips').send(tempProject).end((err, res) => {
              //console.log('body %j', res.body);
              res.should.have.status(201);
              tempProject = res.body;
              return cb(null, tempProject);
            });
          },
          (cb) => {
            //console.log('creating project %j', tempProject);
            chai.request(SERVER_APPLICATION_HOST).get('/api/tips/search/'+ fullDescription.substring(0, 4)).send(tempProject).end((err, res) => {
              if (err) {
                console.error('error searching %j', err);
              }
              //console.log('body %j', res.body);
              res.should.have.status(200);
              res.body.projects.should.not.be.empty;
              return cb(null, tempProject);
            });
          }
      ], done);
    });

    it('it should find project searching by project.', function(done) {

      let tempProject = COMMAND_OBJECT_MOCK;
      let project = randomstring.generate();
      tempProject.project = project;

      async.series([
          (cb) => {
            VALID_USER_MOCK.email = VALID_USER_MOCK.email + randomstring.generate(5);
            chai.request(SERVER_APPLICATION_HOST).post('/api/users').send(VALID_USER_MOCK).end((err, res) => {
              //console.log('user created %j', res.body);
              res.should.have.status(201);
                tempProject.userId = res.body.user._id;
                //console.log('temp commad %j', tempProject);
                return cb(null, tempProject);
            })

          },
          (cb) => {
            tempProject.title = tempProject.title + randomstring.generate(6);
            //console.log('creating project %j', tempProject);
            chai.request(SERVER_APPLICATION_HOST).post('/api/tips').send(tempProject).end((err, res) => {
              //console.log('body %j', res.body);
              res.should.have.status(201);
              tempProject = res.body;
              return cb(null, tempProject);
            });
          },
          (cb) => {
            //console.log('creating project %j', tempProject);
            chai.request(SERVER_APPLICATION_HOST).get('/api/tips/search/' +
              project.substring(0, Math.floor(Math.random() * Math.floor(project.length)))).send(tempProject).end((err, res) => {
              if (err) {
                console.error('error searching %j', err);
              }
              //console.log('body %j', res.body);
              res.should.have.status(200);
              res.body.projects.should.not.be.empty;
              return cb(null, tempProject);
            });
          }
      ], done);
    });

    it('it should not find project.', function(done) {

      let tempProject = COMMAND_OBJECT_MOCK;

      async.series([
          (cb) => {
            VALID_USER_MOCK.email = VALID_USER_MOCK.email + randomstring.generate(5);
            chai.request(SERVER_APPLICATION_HOST).post('/api/users').send(VALID_USER_MOCK).end((err, res) => {
              //console.log('user created %j', res.body);
              res.should.have.status(201);
                tempProject.userId = res.body.user._id;
                //console.log('temp commad %j', tempProject);
                return cb(null, tempProject);
            })

          },
          (cb) => {
            tempProject.title = tempProject.title + randomstring.generate(5);
            //console.log('creating project %j', tempProject);
            chai.request(SERVER_APPLICATION_HOST).post('/api/tips').send(tempProject).end((err, res) => {
              //console.log('body %j', res.body);
              res.should.have.status(201);
              tempProject = res.body;
              return cb(null, tempProject);
            });
          },
          (cb) => {
            //console.log('creating project %j', tempProject);
            let invalidDescribe = randomstring.generate();
            chai.request(SERVER_APPLICATION_HOST).get('/api/tips/search/'+ invalidDescribe).send(tempProject).end((err, res) => {
              //console.log('seach body response %j', res.body);
              res.should.have.status(200);
              res.body.projects.should.be.empty;
              return cb(null, tempProject);
            });
          }
      ], done);
    });
  });

});

describe('/PATCH IT - update project', () => {

  let invalidCommandId = '5c48eada47227ff3460dce9b';

  it('it should return project not found error.', (done) => {
    chai.request(SERVER_APPLICATION_HOST)
        .patch('/api/tips/' + invalidCommandId)
        .send(COMMAND_OBJECT_MOCK)
        .end((err, res) => {
              res.should.have.status(404);
              //console.log('response %j', res.body);
              res.body.message.should.equal('Project not found');
          done();
        });
  });

  it('it should update project.', function(done) {

    let tempProject = COMMAND_OBJECT_MOCK;
    const value = randomstring.generate();

    async.series([
        (cb) => {
          VALID_USER_MOCK.email = VALID_USER_MOCK.email + randomstring.generate(5);
          chai.request(SERVER_APPLICATION_HOST).post('/api/users').send(VALID_USER_MOCK).end((err, res) => {
            //console.log('user created %j', res.body);
            res.should.have.status(201);
              tempProject.userId = res.body.user._id;
              //console.log('temp commad %j', tempProject);
              return cb(null, tempProject);
          })
        },
        (cb) => {
          tempProject.title = tempProject.title + randomstring.generate(5);
          //console.log('creating project %j', tempProject);
          chai.request(SERVER_APPLICATION_HOST).post('/api/tips').send(tempProject).end((err, res) => {
            //console.log('body %j', res.body);
            res.should.have.status(201);
            tempProject = res.body;
            return cb(null, tempProject);
          });
        },
        (cb) => {
          //console.log('creating project %j', tempProject);
          const attribute = 'project';
          const increment = false;

          tempProject.increment = increment;
          tempProject.attribute = attribute;
          tempProject.value = value;

          chai.request(SERVER_APPLICATION_HOST)
            .patch('/api/tips/'+ tempProject.project._id)
            .send(tempProject).end((err, res) => {
              if (err) {
                console.log('Error updating project %j.', tempProject);
              }
              console.debug('seach body response %j', res.body);
              res.should.have.status(200);
              tempProject = res.body.project;
              return cb(null, tempProject);
          });
        },
        (cb) => {
          //console.log('id ' +tempProject._id);
          chai.request(SERVER_APPLICATION_HOST).get('/api/tips/' + tempProject._id).end((err, res) => {
            //console.log('user created %j', res.body);
            res.should.have.status(200);
            res.body.project.project.should.equal(value);
            return cb(null, tempProject);
          })
        }
    ], done);
  });

   it('it should update project.', function(done) {

    let tempProject = COMMAND_OBJECT_MOCK;
    const value = randomstring.generate();

    async.series([
        (cb) => {
          VALID_USER_MOCK.email = VALID_USER_MOCK.email + randomstring.generate(5);
          chai.request(SERVER_APPLICATION_HOST).post('/api/users').send(VALID_USER_MOCK).end((err, res) => {
            //console.log('user created %j', res.body);
            res.should.have.status(201);
              tempProject.userId = res.body.user._id;
              //console.log('temp commad %j', tempProject);
              return cb(null, tempProject);
          })
        },
        (cb) => {
          tempProject.title = tempProject.title + randomstring.generate(5);
          //console.log('creating project %j', tempProject);
          chai.request(SERVER_APPLICATION_HOST).post('/api/tips').send(tempProject).end((err, res) => {
            //console.log('body %j', res.body);
            res.should.have.status(201);
            tempProject = res.body;
            return cb(null, tempProject);
          });
        },
        (cb) => {
          //console.log('creating project %j', tempProject);
          const attribute = 'project';
          const increment = false;

          tempProject.increment = increment;
          tempProject.attribute = attribute;
          tempProject.value = value;

          chai.request(SERVER_APPLICATION_HOST)
            .patch('/api/tips/'+ tempProject.project._id)
            .send(tempProject).end((err, res) => {
              if (err) {
                console.log('Error updating project %j.', tempProject);
              }
              console.debug('seach body response %j', res.body);
              res.should.have.status(200);
              tempProject = res.body.project;
              return cb(null, tempProject);
          });
        },
        (cb) => {
          //console.log('id ' +tempProject._id);
          chai.request(SERVER_APPLICATION_HOST).get('/api/tips/' + tempProject._id).end((err, res) => {
            //console.log('user created %j', res.body);
            res.should.have.status(200);
            res.body.project.project.should.equal(value);
            return cb(null, tempProject);
          })
        }
    ], done);
  });

  it('it should increment project works.', function(done) {

    let tempProject = COMMAND_OBJECT_MOCK;
    const value = randomstring.generate();

    async.series([
        (cb) => {
          VALID_USER_MOCK.email = VALID_USER_MOCK.email + randomstring.generate(5);
          chai.request(SERVER_APPLICATION_HOST).post('/api/users').send(VALID_USER_MOCK).end((err, res) => {
            //console.log('user created %j', res.body);
            res.should.have.status(201);
              tempProject.userId = res.body.user._id;
              //console.log('temp commad %j', tempProject);
              return cb(null, tempProject);
          })
        },
        (cb) => {
          tempProject.title = tempProject.title + randomstring.generate(5);
          //console.log('creating project %j', tempProject);
          chai.request(SERVER_APPLICATION_HOST).post('/api/tips').send(tempProject).end((err, res) => {
            //console.log('body %j', res.body);
            res.should.have.status(201);
            tempProject = res.body;
            return cb(null, tempProject);
          });
        },
        (cb) => {
          //console.log('creating project %j', tempProject);
          const attribute = 'works';
          const increment = true;

          tempProject.increment = increment;
          tempProject.attribute = attribute;

          chai.request(SERVER_APPLICATION_HOST)
            .patch('/api/tips/'+ tempProject.project._id)
            .send(tempProject).end((err, res) => {
              if (err) {
                console.log('Error updating project %j.', tempProject);
              }
              console.debug('seach body response %j', res.body);
              res.should.have.status(200);
              tempProject = res.body.project;
              return cb(null, tempProject);
          });
        },
        (cb) => {
          //console.log('id ' +tempProject._id);
          chai.request(SERVER_APPLICATION_HOST).get('/api/tips/' + tempProject._id).end((err, res) => {
            //console.log('user created %j', res.body);
            res.should.have.status(200);
            res.body.project.works.should.be.equal(1);
            return cb(null, tempProject);
          })
        }
    ], done);
  });

  it('it should increment project does not works.', function(done) {

    let tempProject = COMMAND_OBJECT_MOCK;

    async.series([
        (cb) => {
          VALID_USER_MOCK.email = VALID_USER_MOCK.email + randomstring.generate(5);
          chai.request(SERVER_APPLICATION_HOST).post('/api/users').send(VALID_USER_MOCK).end((err, res) => {
            //console.log('user created %j', res.body);
            res.should.have.status(201);
              tempProject.userId = res.body.user._id;
              //console.log('temp commad %j', tempProject);
              return cb(null, tempProject);
          })
        },
        (cb) => {
          tempProject.title = tempProject.title + randomstring.generate(5);
          //console.log('creating project %j', tempProject);
          chai.request(SERVER_APPLICATION_HOST).post('/api/tips').send(tempProject).end((err, res) => {
            //console.log('body %j', res.body);
            res.should.have.status(201);
            tempProject = res.body;
            return cb(null, tempProject);
          });
        },
        (cb) => {
          //console.log('creating project %j', tempProject);
          const attribute = 'doesnt_work';
          const increment = true;

          tempProject.increment = increment;
          tempProject.attribute = attribute;

          chai.request(SERVER_APPLICATION_HOST)
            .patch('/api/tips/'+ tempProject.project._id)
            .send(tempProject).end((err, res) => {
              if (err) {
                console.log('Error updating project %j.', tempProject);
              }
              console.debug('seach body response %j', res.body);
              res.should.have.status(200);
              tempProject = res.body.project;
              return cb(null, tempProject);
          });
        },
        (cb) => {
          //console.log('id ' +tempProject._id);
          chai.request(SERVER_APPLICATION_HOST).get('/api/tips/' + tempProject._id).end((err, res) => {
            //console.log('user created %j', res.body);
            res.should.have.status(200);
            res.body.project.doesnt_work.should.be.equal(1);
            return cb(null, tempProject);
          })
        }
    ], done);
  });

});
*/
