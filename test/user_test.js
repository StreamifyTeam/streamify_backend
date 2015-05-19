'use strict';
process.env.MONGOLAB_URI = 'mongodb://localhost/user_tests';
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;

var mongoose = require('mongoose');
var User = require('../models/User');
chai.use(chaiHttp);

var server = require('../server.js');

describe('User Testing', function() {
  var testToken = '';

  //This is the first test run (see gruntfile.js), so it needs to wait on the server.
  before(function(done) {
    server.once('started', function() {
    chai.request('localhost:3000')
      .post('/api/user/create_user')
      .send({email: 'user@test.com', username: 'testUser', password: 'foobar'})
      .end(function(err, res) {
        testToken = res.body.token;
        /*expect(err).to.eql(null);
        expect(res.body.username).to.eql('testUser');
        expect(res.body.token).to.not.eql('undefined');
        expect(res.status).to.eql(200);*/
        done();
      });
    }); //end server.once('started')
  }); //end before

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
        expect(res.body.username).to.eql('rainer');
        expect(res.body.token.length).to.eql(44);
        expect(res.status).to.eql(200);
        done();
      });
  });

  it('sign in a User', function(done) {
    chai.request('localhost:3000')
    .get('/api/user/sign_in')
    .auth('rainer','foobar')
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.token.length).to.eql(44);
      done();
    });
  });

  it('PUT favorite', function(done) {
    chai.request('localhost:3000')
    .put('/api/user/fav')
    .send({eat: testToken, favorites: 'testFavorite'})
    .end(function(err, res) {
      expect(res.body.msg).to.eql('testFavorite' + ' added as a Favorite');
      expect(err).to.eql(null);
      done();
    });
  });

  it('GET favorite', function(done) {
    chai.request('localhost:3000')
    .get('/api/user/fav')
    .send({eat: testToken})
    .end(function(err, res) {
      expect(res.body.msg).to.eql('Favorites: ' + 'testFavorite');
      expect(err).to.eql(null);
      done();
    });
  });

  it('DELETE favorite', function(done) {
    chai.request('localhost:3000')
    .del('/api/user/fav')
    .send({eat: testToken, favorites: 'testFavorite'})
    .end(function(err, res) {
      expect(res.body.msg).to.eql('testFavorite' + ' has been deleted');
      expect(err).to.eql(null);
      done();
    });
  });
});
