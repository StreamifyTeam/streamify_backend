'use strict';
var mongoose = require('mongoose');

var songSchema = mongoose.Schema({
	artist: {type: String, required: true},
	name: {type: String, unique: true},
	duration: String,
	album: String,
	spotifyID: {type: String, unique: true},
});

module.exports = mongoose.model('Song', songSchema);