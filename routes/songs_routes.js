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

	//find a song by a mongo id
	router.get('/songs/:id', function(req, res) {
		console.log(req.params.id);
		Song.findOne({'_id': req.params.id}, function(err, data){
			if(err){
				console.log(err);
				return res.status(500).json({msg: 'internal server error'});
			}

			res.json({msg: data});
		});
	});

	//find a list of song by a list of id (mongo id)
	router.post('/songs/arrayID', function(req, res) {
		var temp;
		Song.find({'_id': {$in: req.body}}, function(err, data){
			console.log('_id');
			if(err){
				console.log(err);
				return res.status(500).json({msg: 'internal server error'});
			}
			res.json({msg: data});
		});
	});

	//add a new song
	router.post('/songs', function(req, res) {
		var newSong = new Song(req.body);
		Song.findOne({spotifyID: newSong.spotifyID}, function(err, data){
			if(err){
				console.log(err);
				return res.status(500).json({msg: 'internal server error'});
			}
			if(data)
				res.json({msg: 'song exists'})
			else{
				newSong.save(function(err, data){
					if(err){
						console.log(err);
						return res.status(500).json({msg: 'internal server error'});
					}
					res.json({msg: data});
				});
			}
		});
	});

	//delete a song by id
	router.delete('/songs/:id', function(req, res) {
		Song.remove({_id: req.params.id}, true);
		res.end();
  	});
};