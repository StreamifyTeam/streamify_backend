'use strict';

var chai = require('chai');
var chaihttp = require('chai-http');
var expect = chai.expect;
chai.use(chaihttp);
var server = require('../server.js');


describe('Music Discovery for the win', function() {

  it('should search for an artist', function(done) {
    chai.request('localhost:3000')
      .get('/api/discovery/artist/snsd')
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body.artists[0].name).to.eql("Girls' Generation");
        expect(res.body.artists[0].popularity).to.eql(65);
        done();
      });
  });

  it('should search for a genre', function(done) {
    chai.request('localhost:3000')
      .get('/api/discovery/genre/k-pop')
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body.artists[0].name).to.eql("PSY");
        expect(res.body.artists[0].popularity).to.eql(67);
        done();
      });
  });

  it('should give a list of related artists', function(done) {
    chai.request('localhost:3000')
      .get('/api/discovery/related/2uWcrwgWmZcQc3IPBs3tfU')
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body.artists[0].name).to.eql('B1A4');
        expect(res.body.artists[0].popularity).to.eql(53);
        done();
      });
    });

  it('should give a list of top tracks', function(done) {
    chai.request('localhost:3000')
      .get('/api/discovery/top-tracks/2uWcrwgWmZcQc3IPBs3tfU')
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body.tracks[0].name).to.eql('Let Us Just Love');
        done();
      });
  });
});
