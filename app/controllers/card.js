var db = require('../db.js');
var Attend = db.Attend;
var Event = db.Event;
var User  = db.User;

var error = require('../error.js');
var handler = error.message;
var notFound = error.notFound

//Garbage Test Parser
var parser = function(card, done) {
  card = card.split('/20')
  if (card.length === 3) {
    var body = {
      handle: card[0] + '.' + card[1],//TODO: need way to handle this(identikey for CU?)
      sid: card[2],
      first: card[0],
      last: card[1]
    }
  }
  else if (!body) var err = { 'message': 'Parsing Failed' }
  return done(body, err);
}


module.exports = {
  parser: parser,
};
