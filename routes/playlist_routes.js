'use strict';

var Playlist = require('../models/Playlist.js');
var bodyparser = require('body-parser');

//all these routes will be under /api

module.exports = function(router) {
  router.use(bodyparser.json());

  //Get playlists - GET
  //send GET to /api/playlist/
  //message body: {searchString: "search string"}
  router.get('/playlist/', function(req, res) {
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

  //Create playlist - POST with playlist name
  //send POST to /api/create_playlist/
  //message body: {name: "playlistname"} (does not yet take an admin user)
  //must have account, be authenticated
  router.post('/create_playlist', function(req, res) {
    var newPlaylist = new Playlist(req.body);
    newPlaylist.save(function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }
      res.json(data);
    });
  });

  //Delete playlist - DELETE
  //send DEL to /api/delete_playlist/
  //message body: {id: playlistID}
  //must be authenticated - owner
  router.delete('/delete_playlist', function(req, res) {
    Playlist.remove({_id: req.params.id}, function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }

      res.json({msg: 'success'});
    });
  });

  //Add song to playlist - POST
  //send POST to /api/playlist/
  //message body: {id: playlistID, song: spotifySongID}
  //must be authenticated - collaborator
  router.post('/playlist', function(req, res) {
    Playlist.findOne({_id: req.body.id}, function(err, pl) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }
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
  //message body: {name: "playlistname", song: spotifySongID}
  //must be authenticated - collaborator
  router.delete('/playlist', function(req, res) {
    Playlist.findOne({_id: req.body.id}, function(err, pl) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }
      pl.removeSong(req.body.spotifyId);
      pl.save(function(err) {
        if (err) {
          console.log(err);
          return res.status(500).json({msg: 'internal server error'});
        }
        res.json({msg: 'success'});
      }); //end save
    }); //end findOne
  });

  //Update playlist - POST with collaborators, or song to add
  //send POST to /api/playlist/
  //message body: {name: "playlistname", song: {songObject}}
  router.post('/playlist', function(req, res) {
    res.json({msg: 'unimplemented'});
  });

};
