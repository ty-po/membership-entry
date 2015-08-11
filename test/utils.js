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
//---------- JSON Seed Data -----------

var Seed = {
  testuser        : { handle: 'testuser', password: 'password1234', sid: '1111111' },
  targetuser      : { handle: 'targetuser', password: 'asdf', sid: '1111110' },

  targetorg       : { url: 'targetorg', name: 'TestCo', ownerHandle: 'joseph' },
  ownedorg        : { url: 'targetorg', name: 'TestCo', ownerHandle: 'testuser' },

  targetevent     : { name: 'Quality Gathering', url: 'targetorg' },

  targetstanding  : { url: 'targetorg', handle: 'targetuser',  isMember: true },

  memberstanding  : { url: 'targetorg', handle: 'testuser', isMember: true },
  adminstanding   : { url: 'targetorg', handle: 'testuser', isAdmin: true },

  targetattend    : { handle: 'joseph' },
}

//--------- Helper Functions ----------
var makeUser = function(spec, done) {
  var user = new db.User({
    handle:   spec.handle,
    sid:      spec.sid,
    first:    spec.first,
    last:     spec.last,
    email:    spec.email,
    created:  Date.now(),
    auth:     spec.password
  });
  user.save(function(err, user) {
    if(err) return console.log('User Creation Failed');
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
    if(err) return console.log('Org Creation Failed');
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
  standing.save(function(err, standing) {
    if(err) return console.log('Standing Creation Failed');
    return done();
  });
}

var makeEvent = function(spec, done) {
  var event = new db.Event({
    name: spec.name,
    org: spec.url,
  });
  event.save(function(err, event) {
    if(err) return console.log('Event Creation Failed');
    return done(event._id);
  });
}

var makeAttend = function(spec, done) {
  var attend = new db.Attend({
    event: spec.id,
    user: spec.handle,
    timeIn: Date.now(),
  });
  attend.save(function(err, attend) {
    if(err) return console.log('Attend Creation Failed');
    return done();
  });
}

module.exports = {
  makeUser: makeUser,
  makeOrg:  makeOrg,
  makeStanding: makeStanding,
  makeEvent: makeEvent,
  makeAttend: makeAttend,
  Seed: Seed,
};
