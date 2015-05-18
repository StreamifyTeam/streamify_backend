'use strict';

var Song = require('..models/Song');
var bodyparser = require('body-parser');

module.exports = function(router){
	router.use(bodyparser.json());

	router.get('/songs', function(req, res){
		Song.find({songID: req.user._id}, function(err, data){
			if(err){
				console.log(err);
				return res.status(500).json({msg: 'internal server error'});
			}

			res.json(data);
		});
	});

	router.post('/songs', function(req, res){
		var newSong = new Song(req.body);
		newSong.songID = req.user._id;
		newSong.save(function(err, data){
			if(err){
				console.log(err);
				return res.status(500).json({msg: 'internal server error'});
			}
			res.json(data);
		});
	});

	router.delete('/songs/:id', function(req, res) {
    	Song.remove({_id: req.params.id}, true);
    	res.end();
  	});
};