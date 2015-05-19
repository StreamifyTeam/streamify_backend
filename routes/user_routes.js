'use strict';

var eatAuth = require('../lib/eat_auth')(process.env.APP_SECRET);
var User = require('../models/User');
var bodyparser = require('body-parser');

module.exports = function(router, passport) {
		router.use(bodyparser.json());

		router.post('/user/create_user', function(req, res) {
			var newUserData = JSON.parse(JSON.stringify(req.body));
			delete newUserData.email;
			delete newUserData.password;
			var newUser = new User(newUserData);
			newUser.email = req.body.email;
			newUser.generateHash(req.body.password, 8, function (err, hash) {
				if (err) {
					console.log(err)
				}

				newUser.password = hash;
				saveUserAsync();
			});

			function saveUserAsync() {
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

					res.json({token: token});	
				});
			});
			};
		});

		router.get('/user/sign_in', passport.authenticate('basic', {session: false}), function(req, res) {
			req.user.generateToken(process.env.APP_SECRET, function (err, token) {
				if (err) {
					console.log(err);
					return res.status(500).json({msg: 'error generating token'});
				}

				res.json({token: token});
			});
		});

		router.get('/user/fav', eatAuth, function(req, res) {

			res.json({msg: 'Favorites: ' + req.user.favorites});
		});

//for the docs: to add to favorites do put {favorites: 'itemtoadd'}

		router.put('/user/fav', eatAuth, function(req, res) {
			var addToFavorites = req.body.favorites;
			User.find({ 'favorites' : addToFavorites}, function(err, data) {
				if (err) {
					console.log(err);
					return res.status(500).json({msg: 'internal server error'});
				}
				if (data.length > 0) {
					return res.json({msg: 'Already exists as a favorite'});
				} else {
					User.update({ $addToSet: {favorites: addToFavorites} }, function(err, data) {
						if (err) {
							console.log(err);
							return res.status(500).json({msg: 'internal server error'});
						}
					});

				res.json({msg: addToFavorites + ' added as a Favorite'});
				}
			});
		});

		router.delete('/user/fav', eatAuth, function(req, res) {
			var favoriteToBeRemoved = req.body.favorites;
			User.find({ 'favorites' : favoriteToBeRemoved}, function(err, data) {
				if (err) {
					console.log(err);
					return res.status(500).json({msg: 'internal server error'});
				}
				if (data.length === 0) {
					return res.json({msg: 'Could not find favorite'});
				} else {
					User.update({ $pull: {favorites: favoriteToBeRemoved} }, function(err, data) {
						if (err) {
							console.log(err);
							return res.status(500).json({msg: 'internal server error'});
						}

						res.json({msg: favoriteToBeRemoved + ' has been deleted'});
					});
				}
			});
		});
};
