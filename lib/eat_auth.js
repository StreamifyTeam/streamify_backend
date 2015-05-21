'use strict';

var eat = require('eat');
var User = require('../models/User');

module.exports = function(secret) {
	return function(req, res, next) {
		var token = req.headers.eat || req.body.eat;
		var expired = Date.now() - 6048000000; //6048000000 is 10 weeks
		if (!token) {
			console.log('unauthorized no token in request');
			return res.status(401).json({msg: 'not authorized'});
		}

		eat.decode(token, secret, function(err, decoded) {
			if (err) {
				console.log(err);
				return res.status(401).json({msg: 'not authorized'});
			}

			if(decoded.timestamp < expired) {
				return res.status(401).json({msg: 'expired token'});
			}

			User.findOne({uniqueHash: decoded.id}, function(err, user) {
				if (err) {
					console.log(err);
					return res.status(401).json({msg: 'not authorized'});
				}

				if (!user) {
					console.log('no user found for that token');
					return res.status(401).json({msg: 'not authorized'});
				}

				req.user = user;
				next();
			});
		});
	};
};
