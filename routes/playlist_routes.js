'use strict';

var Playlist = require('../models/Playlist.js');
var bodyparser = require('body-parser');
var eatAuth = require('../lib/eat_auth.js')(process.env.APP_SECRET);
var Song = require('../models/Song');

var http = require('http');


//all these routes will be under /api

module.exports = function(router) {
  router.use(function(req, res, next) {
    console.log(req);
    next();
  });
  router.use(bodyparser.json());

  //Finds all playlists with a certain word (or words) in its name
  //send POST to /api/playlist/search
  //http headers: searchString=searchstring, eat=token
  router.post('/playlist/search', eatAuth, function(req, res) {
    //basic regular expression: true if playlist name contains our string
    Playlist.find({name: new RegExp(req.body.searchString, 'i')},
    function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }
      res.json(data);
    });
  });

  //Gets all of a user's playlists
  //send POST to /api/playlist/mine
  //message body: {eat: token}
  router.post('/playlist/mine', eatAuth, function(req, res) {
    Playlist.find({createdBy: req.user._id}, function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }
      res.json(data);
    });
  });

  //Gets all playlists a user is contributing to
  //send POST to /api/playlist/contrib
  //message body: {eat: token}
  router.post('/playlist/contrib', eatAuth, function(req, res) {
    Playlist.find({'collaborators.$': req.user._id}, function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }
      res.json(data);
    });
  });

  //Create playlist
  //send POST to /api/create_playlist/
  //message body: {name: "playlistname", eat: token}
  router.post('/create_playlist', eatAuth, function(req, res) {
    var newPlaylist = new Playlist(req.body);
    newPlaylist.dateCreated = (new Date()).toDateString();
    newPlaylist.createdBy = req.user._id;
    //newPlaylist.collaborators.push(req.user._id);
    newPlaylist.save(function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }
      //respond with the playlist
      res.json(data);
    });
  });

  //Delete playlist - DELETE
  //send DEL to /api/delete_playlist/
  //message body: {id: playlistID, eat: token}
  router.delete('/delete_playlist', eatAuth, function(req, res) {
    Playlist.remove({_id: req.body.id}, function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }

      res.json({msg: 'success'});
    });
  });

  //Add song to playlist - POST
  //send POST to /api/playlist/
  //message body: {eat: token, id: playlistID, song: spotifySong}
  router.post('/playlist', eatAuth, function(req, res) {
    Playlist.findOne({_id: req.body.id}, function(err, pl) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }
      //console.log('Found the playlist.');
      //add the song's ID to our playlist and save it
      pl.addSong(req.body.song);
      pl.save(function(err) {
        if (err) {
          console.log(err);
          return res.status(500).json({msg: 'internal server error'});
        }
        res.json({msg: 'success'});
      }); //end save
    }); //end findOne
  });

  //Remove song from playlist - DELETE
  //send DEL to /api/playlist/
  //message body: {eat: token, id: playlistID, song: songID}
  //Will respond with the updated playlist
  router.delete('/playlist', eatAuth, function(req, res) {
    Playlist.findOne({_id: req.body.id}, function(err, pl) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }
      pl.removeSong(req.body.song);
      pl.save(function(err, data) {
        if (err) {
          console.log(err);
          return res.status(500).json({msg: 'internal server error'});
        }
        res.json(data);
      }); //end save
    }); //end findOne
  });

  //Update playlist - POST with collaborators, or song to add
  //send POST to /api/playlist/
  //message body: {name: "playlistname", song: {songObject}}
  //router.post('/playlist', function(req, res) {
   // res.json({msg: 'unimplemented'});
  //});

  //Play song - POST
  //message body: {id: playlistId, eat: token}
  //Returns the id of the next song of the playlist, and removes the song
  router.post('/playlist/update', eatAuth, function(req, res) {
    Playlist.findOne({_id: req.body.id}, function(err, pl) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }
      
      var song = pl.playNextSong(req.body.song);
      pl.save(function(err) {
        if (err) {
          console.log(err);
          return res.status(500).json({msg: 'internal server error'});
        }
        res.json(song);
      }); //end save
    }); //end findOne
  });

};
