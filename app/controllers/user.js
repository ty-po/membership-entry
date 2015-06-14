var db = require('../db.js');
var User = db.User;

var error = require('../error.js').message;


var post = function(req, res) {
  var user = new User({
    handle: req.body.handle,
    name:   req.body.name,
    email:  req.body.email,
    created: Date.now()
  });

  user.save(function(err, user) {
    if (err) return error(err, res);
    res.json(user);
  });
};

var getAll = function(req, res) {
  User.find({}, 'handle _id', function(err, users){
    if (err) return error(err, res);
    res.json(users);
  });
};

var get = function(req, res) {
  User.find({'handle': req.params.handle}, function(err, user) {
    if (err) return error(err, res);
    res.json(user);
  });
};

var put = function(req, res) {
  User.findOne({'handle': req.params.handle}, function(err, user) { 
    if (err) return error(err, res);

    user.name   = req.body.name,
    user.email  = req.body.email 

    user.save(function(err, user) {
      if (err) return error(err, res);
      res.json(user);
    });
  });
};
var del = function(req, res) {
  User.findOneAndRemove({'handle': req.params.handle}, function(err) {
    if(err) return err(err, res);
    res.json({ message: 'Successfully removed' });
  });
};


module.exports = {
  post: post,
  getAll: getAll,

  get: get,
  put: put,
  del: del
};
