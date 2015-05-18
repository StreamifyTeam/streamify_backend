'use strict';
var mongoose = require('mongoose');

var songSchema = mongoose.Schema({
	artist: String,
	title: String,
	length: String,
	spotifyID: String,
	albume: String,
	genre: String,
	songID: Number
});

module.exports = mongoose.model('Song', songSchema);