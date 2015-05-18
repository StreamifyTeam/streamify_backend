'use strict';

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
				saveFunc();
			});
			function saveFunc() {
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
};