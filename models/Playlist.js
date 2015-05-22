'use strict';

var mongoose = require('mongoose');

var playlistSchema = mongoose.Schema({
  name: String,
  songs: Array,
  dateCreated: String,
  createdBy: String,
  collaborators: Array
});

playlistSchema.methods.addSong = function(song) {
  //Change this; you'll be receiving a struct containing all of the song info, which you can then pass to Song
  this.songs.push(song);
};

//Given a song ID, finds that song in the playlist and removes it.
playlistSchema.methods.removeSong = function(songId) {
  //(refactor this later)
  this.songs.forEach(function(item, index, array) {
    if (item === songId) {
      return array.splice(index, 1)[0];
    }
  });
};
playlistSchema.methods.playNextSong = function() {
  this.songs.pop(); //remove previous track
  return this.songs[0];
};
playlistSchema.methods.randomize = function() {

};

module.exports = mongoose.model('Playlist', playlistSchema);
