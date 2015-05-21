'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;

var mongoose = require('mongoose');
//var Playlist = require('../models/Playlist.js');

chai.use(chaiHttp);

describe('Playlist API', function() {
  var testPlaylistID;
  var testToken;
  var idOfSongToDelete;

  before(function(done) {
    chai.request('localhost:3000')
    .post('/api/user/create_user')
    .send({email: 'user@test.com', username: 'testUser', password: 'foobar'})
    .end(function(err, res) {
      testToken = res.body.token;
      expect(err).to.eql(null);
      expect(res.body.username).to.eql('testUser');
      expect(res.body.token).to.not.eql('undefined');
      expect(res.status).to.eql(200);
      done();
    });
  }); //end before

  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      //mongoose.connection.db.emit('first tests done');
      done();
    });
  });

  it('should be able to add a new playlist', function(done) {
    //console.log('sending new playlist');
    chai.request('localhost:3000')
      .post('/api/create_playlist')
      .send({eat: testToken, name: 'Test Playlist 1'})
      .end(function(err, res) {
        //console.log('res received');
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(res.body).to.have.property('_id');
        expect(res.body.name).to.eql('Test Playlist 1');
        //expect(res.body.createdBy).to.eql()
        //add tests for collaborator, owner, etc... once users are integrated
        testPlaylistID = res.body._id;
        done();
      });
  });

  it('should be able to post an array of specific existing playlists', function(done) {
    //Add a second playlist
    chai.request('localhost:3000')
      .post('/api/create_playlist')
      .send({name: '~~Magic~~***', eat: testToken})
      .end(function(err, res) {
        expect(err).to.eql(null);
      });
    chai.request('localhost:3000')
      .post('/api/playlist/search')
      .send({searchString: 'Test', eat: testToken})
      //.post(encodeURIComponent('/api/playlist/search?searchString=Test&eat=' + testToken))
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(typeof res.body).to.eql('object');
        expect(Array.isArray(res.body)).to.eql(true);
        expect(res.body.length).to.eql(1);
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
      .send({eat: testToken,
            id: testPlaylistID,
            song: {
              artistName: "The Beatles",
              trackName: 'With A Little Help From My Friends',
              duration: '3:02',
              albumName: 'Sgt. Pepper\'s Lonely Hearts Club Band',
              uri: 'foobar39103'}})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(res.body.msg).to.eql('success');

        //Add one more song for the next test
        chai.request('localhost:3000')
        .post('/api/playlist')
        .send({eat: testToken,
              id: testPlaylistID,
              song: {
                artistName: "The Beatles",
                trackName: 'Lucy In The Sky With Diamonds',
                duration: '2:48',
                albumName: 'Sgt. Pepper\'s Lonely Hearts Club Band',
                uri: 'barfoo2205'}})
        .end(function(err, res) {
          chai.request('localhost:3000')
          .post('/api/playlist')
          .send({eat: testToken,
                id: testPlaylistID,
                song: {
                  artistName: "The Beatles",
                  trackName: 'Lucy In The Sky With Diamonds',
                  duration: '2:48',
                  albumName: 'Sgt. Pepper\'s Lonely Hearts Club Band',
                  uri: 'barfoo2205'}})
          .end(function(err, res) {
            chai.request('localhost:3000')
            .post('/api/playlist/search')
            .send({searchString: 'Test', eat: testToken})
            //.post(encodeURIComponent('/api/playlist/search?searchString=Test&eat=' + testToken))
            .end(function(err, res) {
              idOfSongToDelete = res.body[0].songs[1];
              //console.log(res.body[0].songs);
              done();
            });
          });
        });
      });
  });

  it('should be able to remove a song from a playlist', function(done) {
    chai.request('localhost:3000')
      .delete('/api/playlist')
      .send({eat: testToken, id: testPlaylistID, song: idOfSongToDelete})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(Array.isArray(res.body.songs)).to.eql(true);
        expect(res.body.songs.length).to.eql(2);
        done();
      });
  });

  it('should be able to delete a playlist', function(done) {
    chai.request('localhost:3000')
      .delete('/api/delete_playlist')
      .send({id: testPlaylistID, eat: testToken})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(res.body.msg).to.eql('success');
        
        chai.request('localhost:3000')
        .post('/api/playlist/search')
        //.post(encodeURIComponent('/api/playlist/search?searchString=Magic&eat=' + testToken))
        .send({searchString: 'Magic', eat: testToken})
        .end(function(err, res) {
          expect(Array.isArray(res.body)).to.eql(true);
          expect(res.body.length).to.eql(1);
          done();
        });
      });
  });

}); //end describe
