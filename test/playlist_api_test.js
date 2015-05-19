'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;

var mongoose = require('mongoose');
//var Playlist = require('../models/Playlist.js');

chai.use(chaiHttp);

var server = require('../server.js'); //run our server

describe('Playlist API', function() {
  var testPlaylistID;

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

  it('should be able to add a new playlist', function(done) {
    chai.request('localhost:3000')
      .post('/api/create_playlist')
      .send({name: 'Test Playlist 1'})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(res.body).to.have.property('_id');
        expect(res.body.name).to.eql('Test Playlist 1');
        //add tests for collaborator, owner, etc... once users are integrated
        testPlaylistID = res.body._id;
        done();
      });
  });

  it('should be able to get an array of existing playlists', function(done) {
    //Add a second playlist
    chai.request('localhost:3000')
      .post('/api/create_playlist')
      .send({name: 'Test Playlist 2'})
      .end(function(err, res) {
        expect(err).to.eql(null);
      });
    chai.request('localhost:3000')
      .get('/api/playlist')
      .send({searchString: 'Test'})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(typeof res.body).to.eql('object');
        expect(Array.isArray(res.body)).to.eql(true);
        res.body.forEach(function(item) {
          expect(item.name).to.contain('Test');
        });
        //(feel free to add more)
        done();
      });
  });

  it('should be able to add a song to a playlist', function(done) {
    chai.request('localhost:3000')
      .post('/api/playlist')
      .send({id: testPlaylistID,
             song: {title: 'With A Little Help From My Friends',
                    artist: 'The Beatles',
                    spotifyId: 125}})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(res.body.msg).to.eql('success');
        done();
      });
  });

  it('should be able to remove a song from a playlist', function(done) {
    chai.request('localhost:3000')
      .delete('/api/playlist')
      .send({id: testPlaylistID, songId: 125})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(res.body.msg).to.eql('success');
        done();
      });
  });

  it('should be able to delete a playlist', function(done) {
    chai.request('localhost:3000')
      .delete('/api/delete_playlist')
      .send({id: testPlaylistID})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(res.body.msg).to.eql('success');
        done();
      });
  });

}); //end describe
