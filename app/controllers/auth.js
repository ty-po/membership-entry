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
          if (!isMatch) { return callback(null, false); }

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
  res.status(401).json({'message': 'Not Your Account'});
}; 

var isOwner   = function(req, res, next) {
  db.Org.findOne({ 'url': req.params.url })
      .select("+ownerHandle")
      .exec(function (err, org) {
    if (err) return next(err);
    if (!org) return next(null, false);
    if (req.user.handle == org.ownerHandle) {
      res.locals.Owner = true;
      return next();
    }
    res.locals.Owner = false;
    return next();
  });
};

var isMember  = function(req, res, next) {
  isOwner(req, res, function(){  
    if (res.locals.Owner) return next();
    db.Standing.findOne({ 'org': req.params.url, 'user': req.user.handle }, 
        function(err, standing) {    
      if (err) return error(err);
      if (!standing) return res.status(401).json({'message': 'No Standing with Org'});
      if (standing.isMember || standing.isAdmin) return next();

      return res.status(401).json({'message': 'Not a Member'});
    });
  });
};



var isAdmin   = function(req, res, next) {
  isOwner(req, res, function(){ 
    if (res.locals.Owner) return next();
    db.Standing.findOne({ 'org': req.params.url, 'user': req.user.handle }, 
        function(err, standing) {    
      if (err) return error(err);
      if (!standing) return res.status(401).json({'message': 'No Standing with Org'});
      if (standing.isAdmin) return next();

      return res.status(401).json({'message': 'Not an Admin'});
    });
  });
};


module.exports = {
  strategy: strategy,

  isUser: isUser,
  isMe: isMe,
  isOwner: isOwner,
  isMember: isMember,
  isAdmin: isAdmin
};
