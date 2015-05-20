'use strict';
var bodyparser = require('body-parser');
var http = require('http');
var request = require('request');
module.exports = function (router) {
  router.use(bodyparser.json());

  // takes user's artist and gets a list of matches
  router.get('/discovery/artist/:name', function(req, res) {
    request({
      url: 'https://api.spotify.com/v1/search',
      qs: {q:'artist:' + req.params.name, type:'artist', limit: 10 },
      method: 'GET'}, function(err, response, body) {
        if(err) {
          console.log(err);
          return res.status(500).json({msg: 'internal server error'});
        }
        else {
          var array = JSON.parse(body);
          var results = [];
          array.artists.items.forEach(function(data) {
            var artist = {};
            artist.id = data.id;
            artist.name = data.name;
            artist.popularity = data.popularity;
            if(data.images[0]) artist.url = data.images[data.images.length - 1].url;
            results.push(artist);
          });
          res.json({artists: results});
        }
      }
    );
    });

    router.get('/discovery/genre/:genre', function(req, res) {
      request({
        url: 'https://api.spotify.com/v1/search',
        qs: {q:'genre:' + req.params.genre, type:'artist', limit: 10 },
        method: 'GET'}, function(err, response, body) {
          if(err) {
            console.log(err);
            return res.status(500).json({msg: 'internal server error'});
          }
          else {
            var array = JSON.parse(body);
            var results = [];
            array.artists.items.forEach(function(data) {
              var artist = {};
              artist.id = data.id;
              artist.name = data.name;
              artist.popularity = data.popularity;
              if(data.images[0]) artist.url = data.images[data.images.length - 1].url;
              results.push(artist);
            });
            res.json({artists: results});
        }
      });
    });

    router.get('/discovery/related/:id', function(req, res) {
      request({
        url: 'https://api.spotify.com/v1/artists/' + req.params.id + '/related-artists',
        method: 'GET'}, function(err, response, body) {
          if(err) {
            console.log(err);
            return res.status(500).json({msg: 'internal server error'});
          }
            var array = JSON.parse(body);
            var results = [];
            if(array.error) return res.status(404).json({msg: 'artist not found'});
            array.artists.forEach(function(data) {
              var artist = {};
              artist.id = data.id;
              artist.name = data.name;
              artist.popularity = data.popularity;
              if(data.images[0]) artist.url = data.images[data.images.length - 1].url;
              results.push(artist);
            });
            res.json({artists: results});
      });
    });

    router.get('/discovery/top-tracks/:id', function(req, res) {
      request({
        url: 'https://api.spotify.com/v1/artists/' + req.params.id + '/top-tracks',
        qs: {country: 'US'},
        method: 'GET' } ,function(err, response, body) {
          if(err) {
            console.log(err);
            return res.status(500).json({msg: 'internal server error'});
          }
          var array = JSON.parse(body);
          var results = [];
          if(array.error) return res.status(404).json({msg: 'artist not found'});
          array.tracks.forEach(function(data) {
            var track = {};
            track.id = data.id;
            track.name = data.name;
            track.popularity = data.popularity;
            results.push(track);
          });
          res.json({tracks: results});
      });
    });
};
