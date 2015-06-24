'use strict';

var config = require('../app/config.js');
var mongoose = require('mongoose');

process.env.NODE_ENV = 'test'

var testdb = mongoose.createConnection()

//var testdb = mongoose.connection;

before(function(done) {
  mongoose.connect(config.dbUrl.test);
  mongoose.connection.once('open', function() {
    return done(); 
  });
});

after(function(done) {
  mongoose.connection.models = {};
  mongoose.connection.db.dropDatabase(function() {
    mongoose.connection.close(function() {
      return done();
    });
  });
});


/*
beforeEach(function(done) {

  function clearDB() {
    console.log('clearing');
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove();
    }
    mongoose.connection.models = {};
    return done();
  }

  function reconnect() {
    mongoose.connect(config.dbUrl.test)
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
    mongoose.connection.once('open', clearDB);
  }

  function checkState() {
    switch (mongoose.connection.readyState) {
    case 0:
      reconnect();
      break;
    case 1:
      clearDB();
      break;
    default:
      process.nextTick(checkState);
    }
  }

  checkState();
});

mongoose.connection.on('disconnected', function(){console.log('disconnected')})
mongoose.connection.on('connected', function(){console.log('connected')})

afterEach(function (done) {
  mongoose.connection.db.dropDatabase(function() {
    mongoose.connection.close(function() {
      done();
    });
  });
});
*/
