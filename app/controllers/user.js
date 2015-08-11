var db = require('../db.js');
var User = db.User;

var error = require('../error.js');
var handler = error.message;
var notFound = error.notFound;

var post = function(req, res) {
  User.findOne({'sid': req.body.sid}, '+card', function(err, user){
    if (err) return handler(err, res);
    if (!user) {
      var user = new User({
        handle:   req.body.handle,
        sid:      req.body.sid,
        first:    req.body.first,
        last:     req.body.last,
        email:    req.body.email,
        created:  Date.now(),
        verified: false,
        auth:     req.body.password
      });

      user.save(function(err, user) {
        if (err) return handler(err, res);
        return res.json(user);
      });
    }
    else if (!user.verified && user.card) {
      //user.handle = req.body.handle ||  user.handle; //TODO: is this a good idea?
      //user.first  = req.body.first  ||  user.first;
      // user.last   = req.body.last   ||  user.last; //Assume card is right?
      user.email  = req.body.email;
      user.auth = req.body.password;
      user.verified = true;

      user.save(function(err, user) {
        if (err) return handler(err, res);
        if (process.env.NODE_ENV === 'test') console.log('\t\tUser Verified')
        return res.json(user);
      });
    }
    else {
      return handler({'message': 'User exists'}, res);
    }
  });

};

var getAll = function(req, res) {
  User.find({}, 'handle', function(err, users){
    if (err) return handler(err, res);
    res.json(users);
  });
};

var get = function(req, res) {
  User.findOne({'handle': req.params.handle}, function(err, user) {
    if (err) return handler(err, res);
    if (!user) return notFound({ 'message': 'no such user' }, res);
    res.json(user);
  });
};

var put = function(req, res) {
  User.findOne({'handle': req.params.handle}, '+auth', function(err, user) { 
    if (err) return handler(err, res);
    if (!user) return notFound({ 'message': 'no such user' }, res);
    user.first  = req.body.first  ||  user.first;
    user.last   = req.body.last   ||  user.last;
    user.email  = req.body.email  ||  user.email;
    user.auth = req.body.password ||  user.auth;

    user.save(function(err, user) {
      if (err) return handler(err, res);
      res.json(user);
    });
  });
};

var del = function(req, res) {
  User.findOneAndRemove({'handle': req.params.handle}, function(err) {
    if(err) return handler(err, res);
    res.json({ 'message': 'Successfully removed' });
  });
};


module.exports = {
  post: post,
  getAll: getAll,

  get: get,
  put: put,
  del: del
};
