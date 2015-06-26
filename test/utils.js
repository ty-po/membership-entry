'use strict';

var config = require('../app/config.js');
var mongoose = require('mongoose');
var db = require('../app/db.js');
process.env.NODE_ENV = 'test'

//var testdb = mongoose.createConnection()

//var testdb = mongoose.connection;


beforeEach(function(done) {
  mongoose.connect(config.dbUrl.test);
  mongoose.connection.once('open', function() {
    for (var i in mongoose.connection.collections) {
      console.log
      mongoose.connection.collections[i].remove();
    }
    return done();  
  }); 
});

afterEach(function(done) {
  mongoose.connection.models = {};
  mongoose.connection.db.dropDatabase(function() {
    mongoose.connection.close(function() {
      return done();
    });
  });
});

var makeUser = function(spec, done) {
  var user = new db.User({
    handle:   spec.handle,
    first:    spec.first,
    last:     spec.last,
    email:    spec.email,
    created:  Date.now(),
    auth:     spec.password
  });
  user.save(function(err, user) {
    return done();
  });
};

var makeOrg = function(spec, done) {
  var org = new db.Org({
    url:          spec.url,
    name:         spec.name,
    ownerHandle:  spec.ownerHandle,
  });
  org.save(function(err, org) {
    return done();
  });
};

var makeStanding = function(spec, done) {
  var standing = new db.Standing({
    org: spec.url,
    user: spec.handle,
    isMember: spec.isMember,
    isAdmin: spec.isAdmin,
  });
  standing.save(function(err, org) {
    return done();
  });
}

module.exports = {
  makeUser: makeUser,
  makeOrg:  makeOrg,
  makeStanding: makeStanding,
};
