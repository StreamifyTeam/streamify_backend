'use strict';
var mongoose = require('mongoose');

var songSchema = mongoose.Schema({
	songID: {type: String, required: true},
	artist: {type: String, required: true},
	name: { type: String, unique: true},
	duration: String,
	album: String,
	spotifyID: String,
	genre: String
});

module.exports = mongoose.model('Song', songSchema);