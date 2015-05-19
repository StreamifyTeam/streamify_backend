'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var eat = require('eat');
var userSchema = mongoose.Schema({
	username: { type: String, unique: true },
	email: { type: String },
	password: String,
	userType: String,
	favorites: [],
	history: String,
	uniqueHash: String
});

userSchema.methods.generateHash = function(password, salt, next) {
	bcrypt.genSalt(salt, function(err, salt) {
		if (err) {
			return next(err);
		}

		bcrypt.hash(password, salt, function(err, hash) {
			if (err) {
				return next(err);
			}
			next(null, hash);
		});
	});
};

userSchema.methods.checkPassword = function(password, cb) {
	bcrypt.compare(password, this.password, function(err, response) {
		if (err) {
			return cb(err);
		}

		console.log(response);
		cb(null, response);
	});
};

userSchema.methods.generateToken = function(secret, callback) {
	eat.encode({id: this._id}, secret, callback);
};

userSchema.methods.owns = function(obj) {
	obj.authorId = this._id;
	return obj.authorId;
};

userSchema.methods.addToFavorites = function(fav, next) {
	this.favorites.push(fav);
	next();
};

userSchema.path('userType').validate(function(value) {
	return /spotify|local/i.test(value);
}, 'Invalid userType');

module.exports = mongoose.model('User', userSchema);
