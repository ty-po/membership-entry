'use strict';

var config = require('../app/config.js');
var mongoose = require('mongoose');

process.env.NODE_ENV = 'test'

//var testdb = mongoose.createConnection()

//var testdb = mongoose.connection;


before(function(done) {
  mongoose.connect(config.dbUrl.test);
  mongoose.connection.once('open', function() {
    for (var i in mongoose.connection.collections) {
      console.log
      mongoose.connection.collections[i].remove();
    }
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
