var db = require('../db.js');
var Attend = db.Attend;
var Event = db.Event;
var User  = db.User;

var error = require('../error.js');
var handler = error.message;
var notFound = error.notFound

//Garbage First Parser
var parser = function(card, done) {
  arr = card.split('=')
  if (arr.length == 4) {
    name = arr[2].split(' ');
    fn = name[0];
    ln = name[1].split('/')[1];

    var body = {
      card: card,
      sid: arr[1],
      first: fn,
      last: ln,
      handle: fn + ln//TODO: need way to handle this(identikey for CU?)
    }
  }
  if (!body.sid || !body.handle || !body.card) {
    var err = { 'message': 'Parsing Failed' }
  }
  else {
    return done(body, err);
  }
}


module.exports = {
  parser: parser,
};
