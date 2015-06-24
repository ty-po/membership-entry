var path      = require('path');
var mongoose  = require('mongoose');

var config    = require('./config.js');

var Event = require('./models/event.js');
var Org   = require('./models/org.js');
var User  = require('./models/user.js');

var Attend = require('./models/attend.js');
var Standing = require('./models/standing.js');

var connect = function(env, done) {
  var dbLocation = config.dbUrl[env];

  mongoose.connect(dbLocation);

  var db = mongoose.connection;
  
  console.log('Using ' + dbLocation);

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log('Mongoose connected');
  });

};

module.exports = {
  connect: connect,
  User: User,
  Event: Event,
  Org: Org,
  Attend: Attend,
  Standing: Standing
};
