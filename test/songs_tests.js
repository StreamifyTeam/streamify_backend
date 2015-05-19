'use strict';

process.env.MONGO_URI = 'mongodb://localhost/database';
require('../server.js');
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
			.send({artist: 'test author', name: 'This is Streamify', album: 'Summer'})
			.end(function(err, res){
				expect(err).to.eql(null);
				expect(res.body.artist).to.eql('test author');
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