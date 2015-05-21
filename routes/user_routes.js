'use strict';

var eatAuth = require('../lib/eat_auth')(process.env.APP_SECRET);
var User = require('../models/User');
var bodyparser = require('body-parser');
var uuid = require('uuid');

module.exports = function(router, passport) {
  router.use(bodyparser.json());

  router.get('/user/sign_in', passport.authenticate('basic', {session: false}), function(req, res) {
    req.user.generateToken(process.env.APP_SECRET, function (err, token) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'error generating token'});
      }
      res.json({email: req.user.email, username: req.user.username, token: token});
    });
  });

  router.get('/user/fav', eatAuth, function(req, res) {

    res.json(req.user.favorites);
  });

  // router.get('/user/sign_in/:token', function(req, res) {


  // 	console.log(req.params.token);
  // 	console.log(req.query);
		// res.json({msg: 'hello world'});

		// req.user.generateToken(process.env.APP_SECRET, function (err, token) {
  //     if (err) {
  //       console.log(err);
  //       return res.status(500).json({msg: 'error generating token'});
  //     }
  //     res.json({email: req.user.email, username: req.user.username, token: token});
  //   });

		// User.findOne({username: newUserData.username}, function(err, data) { 
		// 	if(data) {

  //     data.generateToken(process.env.APP_SECRET, function(err, token) {
  //       if(err) {
  //         console.log(err);
  //         return res.status(500).json({msg: 'error generating token'});
  //       }

  //       res.json({email: newUserData.email, username: newUserData.username, token: token});
  //     });
		// 	} else {
		// 		return res.status(500).json({msg: 'token invalid'});
		// 	}
		// });
  // });

  router.post('/user/spotify_user', function(req, res) {
  	var newUserData = JSON.parse(JSON.stringify(req.body));
  	var newUser = new User(newUserData);

		User.findOne({username: newUserData.username}, function(err, data) { 
			if(data) {

      data.generateToken(process.env.APP_SECRET, function(err, token) {
        if(err) {
          console.log(err);
          return res.status(500).json({msg: 'error generating token'});
        }

        res.json({email: newUserData.email, username: newUserData.username, token: token});
      });
			} else {
				createNewUser();
			}
		});

		function createNewUser() {
    delete newUserData.email;
    delete newUserData.password;
    newUser.email = req.body.email;
    newUser.userType = newUserData.userType || 'spotify';
    newUser.uniqueHash = uuid.v4();
    newUser.generateHash(req.body.password, 8, function (err, hash) {
      if (err) {
        console.log(err);
      }

      newUser.password = hash;
      saveUserAsync();
    });
		}

    var saveUserAsync = function() {
    newUser.save(function(err, user) {
      if(err) {
        console.log(err);
        return res.status(500).json({msg: 'could not create user'});
      }

      user.generateToken(process.env.APP_SECRET, function(err, token) {
        if(err) {
          console.log(err);
          return res.status(500).json({msg: 'error generating token'});
        }

        res.json({email: newUser.email, username: newUser.username, token: token});
      });
    });
    };
  });

  router.post('/user/create_user', function(req, res) {
    var newUserData = JSON.parse(JSON.stringify(req.body));
    var newUser = new User(newUserData);
    createNewUser();
    function createNewUser() {

    delete newUserData.email;
    delete newUserData.password;
    newUser.email = req.body.email;
    newUser.userType = newUserData.userType || 'local';
    newUser.uniqueHash = uuid.v4();
    newUser.generateHash(req.body.password, 8, function (err, hash) {
      if (err) {
        console.log(err);
      }

      newUser.password = hash;
      saveUserAsync();
    });
		}

    var saveUserAsync = function() {
    newUser.save(function(err, user) {
      if(err) {
        console.log(err);
        return res.status(500).json({msg: 'could not create user'});
      }

      user.generateToken(process.env.APP_SECRET, function(err, token) {
        if(err) {
          console.log(err);
          return res.status(500).json({msg: 'error generating token'});
        }

        res.json({email: newUser.email, username: newUser.username, token: token});
      });
    });
    };
  });

  router.put('/user/fav', eatAuth, function(req, res) {
    var addToFavorites = req.body.favorites;

    User.update({uniqueHash: req.user.uniqueHash}, { $addToSet: {favorites: addToFavorites} }, function(err, data) {
        if (err) {
          console.log(err);
          return res.status(500).json({msg: 'internal server error'});
        }
      });

    res.json({msg: addToFavorites + ' added as a Favorite'});
  });

  router.delete('/user/fav', eatAuth, function(req, res) {
    var favoriteToBeRemoved = req.body.favorites;

    User.update({uniqueHash: req.user.uniqueHash}, { $pull: {favorites: favoriteToBeRemoved} }, function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }

      res.json({msg: favoriteToBeRemoved + ' has been deleted'});
    });
  });
};