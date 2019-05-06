process.env.NODE_ENV = 'test';
const config = require('./../../config/config');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let Command = require('./../../api/commands/command');
chai.use(chaiHttp);
const server = require('./../../server');

const Mockgoose = require('mockgoose').Mockgoose;
const mongoose = require('mongoose');

let mockgoose = new Mockgoose(mongoose);
mockgoose.helper.setDbVersion('3.2.1');
const SERVER_APPLICATION_HOST = 'http://localhost:8080';

const COMMAND_OBJECT_MOCK = {
  "title":"Executing a cucumber test through maven using an specif tag.",
  "command":"mvn test",
  "links":"",
  "userId":"5c48eada47227ff3460dce9b",
  "tags":"MAVEN"
}

const VALID_USER_MOCK = {
  'username': 'Jean Gray',
  'email': 'jean@mail.com',
  'password': '192837'
  }


before((done) => {
  mockgoose.prepareStorage()
    .then(() =>
      mongoose.connect(config.db.url, {useNewUrlParser: true}, done));
});

describe('Commands', () => {

  beforeEach((done) => {
    Command.remove({}, (err) => {
         done();
      });
  });

  describe('/GET commands by tag', () => {
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
  });

  describe('/GET commands by id', () => {
    it('it should find any command', (done) => {
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
  });

  describe('/POST create command', () => {
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

    it('it should create command.', (done) => {

      let tempCommand = SERVER_APPLICATION_HOST;

      chai.request(SERVER_APPLICATION_HOST)
        .post('/api/users')
        .send(VALID_USER_MOCK)
        .end((err, res) => {
              res.should.have.status(201);
              tempCommand.userId = res.body.property('_id');
          done();
        });

      chai.request(SERVER_APPLICATION_HOST)
          .post('/api/tips')
          .send(tempCommand)
          .end((err, res) => {
                res.should.have.status(201);
                res.body.should.have.property('message').to.be.a('string', 'User not found.');
            done();
          });

    });

  });
});
