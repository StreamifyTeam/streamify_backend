'use strict';
process.env.MONGOLAB_URI = 'mongodb://localhost/user_tests';
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;

var mongoose = require('mongoose');
var User = require('../models/User');
chai.use(chaiHttp);

require('../server.js'); //run our server

describe('User Testing', function() {
  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

  it('create new User', function(done) {
    chai.request('localhost:3000')
      .post('/api/user/create_user')
      .send({username: 'rainer', password: 'foobar'})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        done();
      });
  });
});
