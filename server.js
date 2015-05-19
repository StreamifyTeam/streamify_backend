'use strict';

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var EventEmitter = require('events').EventEmitter;

//Routes (and app.use calls) go here
var discovery = express.Router();
require('./routes/discovery_routes')(discovery);
app.use('/api', discovery);



//Prepare our emitter (to notify Mocha that we're ready to accept connections)
var serverEmitter = module.exports = exports = new EventEmitter();
var server;

//Connect to mongo
console.log('Connecting to mongo...');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/database');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//Once we're connected to mongo, share the connection and start our server
db.once('open', function(callback) {
  console.log('Connected to mongo');
  server = app.listen(process.env.PORT || 3000, function() {
    console.log('Server started on port ' + (process.env.PORT || 3000));
    serverEmitter.emit('started');
  });
});
