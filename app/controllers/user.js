var db = require('../db.js');
var User = db.User;

var error = require('../error.js').message;


var post = function(req, res) {
  var user = new User({
    handle:   req.body.handle,
    first:    req.body.first,
    last:     req.body.last,
    email:    req.body.email,
    created:  Date.now(),
    auth:     req.body.password
  });

  user.save(function(err, user) {
    if (err) return error(err, res);
    res.json(user);
  });
};

var getAll = function(req, res) {
  User.find({}, 'handle', function(err, users){
    if (err) return error(err, res);
    res.json(users);
  });
};

var get = function(req, res) {
  User.findOne({'handle': req.params.handle}, function(err, user) {
    if (err) return error(err, res);
    if (!user) return error({ 'message': 'no such user' }, res);
    res.json(user);
  });
};

var put = function(req, res) {
  User.findOne({'handle': req.params.handle}, '+auth', function(err, user) { 
    if (err) return error(err, res);
    if (!user) return error({ 'message': 'no such user' }, res);
    user.first  = req.body.first  ||  user.first;
    user.last   = req.body.last   ||  user.last;
    user.email  = req.body.email  ||  user.email;
    user.auth = req.body.password ||  user.auth;

    user.save(function(err, user) {
      if (err) return error(err, res);
      res.json(user);
    });
  });
};

var del = function(req, res) {
  User.findOneAndRemove({'handle': req.params.handle}, function(err) {
    if(err) return error(err, res);
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
