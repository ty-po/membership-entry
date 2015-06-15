var mongoose = require('mongoose');

var Event = require('./models/event.js');
var Org   = require('./models/org.js');
var User  = require('./models/user.js');

var Attend = require('./models/attend.js');
var Standing = require('./models/standing.js');

connect = function() {

  mongoose.connect('mongodb://localhost/membership-entry');

  var db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log('mongoose connected');
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
