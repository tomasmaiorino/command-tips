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
      chai.request('http://localhost:8080')
          .get('/api/tips/tags/test')
          .end((err, res) => {
            console.log('error ' +err);
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
      chai.request('http://localhost:8080')
          .get('/api/tips/5c4f853e8f91855d711176f6')
          .then((res) => {
            res.should.have.status(404);
            done();
          })
          .catch((err) => {
            console.log('find by id error ' + err);
            done();
          })
          /*
          .end((err, res) => {
            console.log('açç errprs' + err);
                res.should.have.status(404);
            done();
          });
          */
    });
  });
});
