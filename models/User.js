'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var eat = require('eat');
var uuid = require('uuid');
var userSchema = mongoose.Schema({
	username: { type: String, unique: true },
	email: { type: String, default: 'no email provided' },
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

		cb(null, response);
	});
};

userSchema.methods.generateToken = function(secret, callback) {
	eat.encode({id: this.uniqueHash, timestamp: Date.now()}, secret, callback);
};

userSchema.methods.owns = function(obj) {
	obj.authorId = this._id;
	return obj.authorId;
};

userSchema.methods.addToFavorites = function(fav, next) {
	this.favorites.push(fav);
	next();
};

module.exports = mongoose.model('User', userSchema);
