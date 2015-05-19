'use strict';

var mongoose = require('mongoose');

var playlistSchema = mongoose.Schema({
  name: String,
  songs: Array,
  dateCreated: Date,
  createdBy: Number,
  collaborators: Array
});

playlistSchema.methods.addSong = function(song) {
  this.songs.push(song);
};

//Given a song ID, finds that song in the playlist and removes it.
playlistSchema.methods.removeSong = function(songId) {
  //(refactor this later)
  this.songs.forEach(function(item, index) {
    if (item.spotifyId === songId) {
      return this.songs.splice(index, 1)[0];
    }
  });
};
playlistSchema.methods.playNextSong = function() {
  this.songs.shift(); //remove previous track
  return this.songs[0];
};
playlistSchema.methods.randomize = function() {

};

module.exports = mongoose.model('Playlist', playlistSchema);
