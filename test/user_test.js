'use strict';
process.env.MONGOLAB_URI = 'mongodb://localhost/user_tests';
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;

var mongoose = require('mongoose');
var User = require('../models/User');
chai.use(chaiHttp);

var server = require('../server.js'); //run our server

describe('User Testing', function() {

  before(function(done) {
    server.once('started', function() {
      done();
    });
  });
  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

  it('create new User', function(done) {
    chai.request('localhost:3000')
      .post('/api/create_user')
      .send({email: 'test@rainer.com', username: 'rainer', password: 'foobar'})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        done();
      });
  });
});
