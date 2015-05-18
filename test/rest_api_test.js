'use strict';

//This is just taken from an earlier assignment for convenience, cut stuff out as needed.
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;

var mongoose = require('mongoose');
var Rabbit = require('../lib/models/models.js').Rabbit;

chai.use(chaiHttp);

var server = require('../lib/server.js'); //run our server

describe('Single-Resource REST API', function() {

  before(function(done) {
    server.once('started', function() {
      done();
    });
  });
  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      //mongoose.connection.db.emit('first tests done');
      done();
    });
  });

  it('should be able to add a new rabbit', function(done) {
    chai.request('localhost:3000')
      .post('/rabbits')
      .send({name: 'Shrubs', weight: 10})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(res.body).to.have.property('_id');
        expect(res.body.name).to.eql('Shrubs');
        done();
      });
  });

  it('should be able to get an array of all rabbits', function(done) {
    chai.request('localhost:3000')
      .get('/rabbits')
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(typeof res.body).to.eql('object');
        expect(Array.isArray(res.body)).to.eql(true);
        done();
      });
  });
});

describe('REST API continued', function() {
  var testRabbit;
  beforeEach(function(done) {
    testRabbit = new Rabbit({name: 'Buckles', weight: '6'});
    testRabbit.save(function(err, data) {
      if (err) throw err;
      testRabbit = data;
      done();
    });
  });
  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

  it('should be able to update a rabbit', function(done) {
    chai.request('localhost:3000')
      .put('/rabbits')
      .send({name: 'Buckles 2', weight: 11, _id: testRabbit._id})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(res.body.msg).to.eql('success');
        done();
      });
  });

  it('should be able to delete a rabbit', function(done) {
    chai.request('localhost:3000')
      .delete('/rabbits')
      .send({_id: testRabbit._id})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(res.body.msg).to.eql('success');
        done();
      });
  });

  it('should have a 404 page', function(done) {
    chai.request('localhost:3000')
    .get('/rtyui873v98y3v')
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.eql(404);
      expect(res.body.msg).to.eql('Could not find page.');
      done();
    });
  });
}); //end describe
