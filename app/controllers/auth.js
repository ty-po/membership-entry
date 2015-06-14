var passport        = require('passport');
var BasicStrategy  = require('passport-http').BasicStrategy;
var db              = require('../db.js');
var error           = require('../error.js').message;

var strategy = function() {
  passport.use(new BasicStrategy(
    function(handle, auth, callback) {
      db.User.findOne({'handle': handle})
          .select("+auth")
          .exec(function (err, user) {

        if (err) { return callback(err); }
        // No user found with that id
        if (!user) { return callback(null, false); }
        // Make sure the auth is correct
        user.verifyAuth(auth, function(err, isMatch) {
          if (err) { return callback(err); }
          // Auth did not match
          if (!isMatch) { return callback(null, user); }
          // Success
          return callback(null, user);
        });
      });
    }
  ));
};

var isUser    = passport.authenticate('basic', { session: false })

var isMe      = function(req, res, next){
  if (req.user.handle == req.params.handle) return next();
  res.status(401).send('Not Your Account');
}; 

var isOwner   = function(req, res, callback) {
  db.Org.findOne({ 'url': req.params.url })
      .select("+ownerHandle")
      .exec(function (err, org) {
    if (err) return callback(err);
    if (!org) return callback(null, false);
    if (req.user.handle == org.ownerHandle) return callback(null, org);
    return callback(null, false);
  });
};

var isMember  = function() {};
var isAdmin   = function() {};


module.exports = {
  strategy: strategy,

  isUser: isUser,
  isMe: isMe,
  isOwner: isOwner,
  isMember: isMember,
  isAdmin: isAdmin
};
