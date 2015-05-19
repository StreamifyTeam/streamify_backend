'use strict';

process.env.MONGO_URI = 'mongodb://localhost/database_test';
require('../server.js'); //run our server
var mongoose = require('mongoose');
var chai = require('chai');
var chaihttp = require('chai-http');
var expect = chai.expect;
var Song = require('../models/Song');

chai.use(chaihttp);

describe('Song REST api', function(){
	after(function(done){
		mongoose.connection.db.dropDatabase(function(){
			done();
		});
	});

	it('should be able to create a new song', function(done){
		chai.request('localhost:3000')
			.post('/api/songs')
			.send({artist: 'CodeFellows', name: 'JavaScript', album: 'Summer', spotifyID: 'test spotify id'})
			.end(function(err, res){
				expect(err).to.eql(null);
				expect(res.body.artist).to.eql('CodeFellows');
				expect(res.body).to.have.property('_id');
				done();
			});
	});

	it('should be able to get a song by song name', function(done){
		chai.request('localhost:3000')
			.get('/api/songs/JavaScript')
			.end(function(err, res){
				expect(err).to.eql(null);
				expect(res.body.artist).to.eql('CodeFellows');
				expect(res.body.name.toString()).to.eql('JavaScript');
				expect(res.body).to.have.property('_id');
				done();
			});

	});

	it('should be able to get an array of songs', function(done){
		chai.request('localhost:3000')
			.get('/api/songs')
			.end(function(err, res){
				expect(err).to.eql(null);
				expect(typeof res.body).to.eql('object');
				expect(Array.isArray(res.body)).to.eql(true);
				done();
			});
	});
});