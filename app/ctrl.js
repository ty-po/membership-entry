var Event   = require('./controllers/event.js');
var Org     = require('./controllers/org.js');
var User    = require('./controllers/user.js');

var Attend  = require('./controllers/attend.js');
var Standing  = require('./controllers/standing.js');

var Auth    = require('./controllers/auth.js');


module.exports = {
  Event: Event,
  Org: Org,
  User: User,

  Attend: Attend,
  Standing: Standing,

  Auth: Auth
};
