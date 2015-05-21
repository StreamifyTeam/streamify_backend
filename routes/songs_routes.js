'use strict';

var Song = require('../models/Song');
var bodyparser = require('body-parser');

module.exports = function(router){
	router.use(bodyparser.json());

	//get all songs
	router.get('/songs', function(req, res) {
		Song.find({}, function(err, data){
			if(err){
				console.log(err);
				return res.status(500).json({msg: 'internal server error'});
			}

			res.json(data);
		});
	});

	//find a song by spotifyID
	router.get('/songs/:id', function(req, res) {
		console.log('Finding a song by spotifyID');
		Song.findOne({spotifyID: req.params.id}, function(err, data){
			console.log('Finished looking for a song by spotifyID');
			if(err){
				console.log(err);
				return res.status(500).json({msg: 'internal server error'});
			}

			res.json(data);
		});
	});

	//find a list of song by a list of id
	router.post('/songs/arrayID', function(req, res) {
		Song.find({spotifyID: {$in: req.body}}, function(err, data){
			if(err){
				console.log(err);
				return res.status(500).json({msg: 'internal server error'});
			}
			res.json(data);
		});
	});

	//add a new song
	router.post('/songs', function(req, res) {
		var newSong = new Song(req.body);
		newSong.save(function(err, data){
			if(err){
				console.log(err);
				return res.status(500).json({msg: 'internal server error'});
			}
			res.json(data);
		});
	});

	//delete a song by id
	router.delete('/songs/:id', function(req, res) {
		Song.remove({_id: req.params.id}, true);
		res.end();
  	});
};