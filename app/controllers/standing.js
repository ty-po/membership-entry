var db  = require('../db.js');
var Standing = db.Standing;

var error = require('../error.js');
var handler = error.message;
var notFound = error.notFound;

var post = function(req, res) {
  Standing.findOne({'org': req.params.url, 'user': req.body.handle}, 
      function(err, standing) {
    if(!standing) {
      db.Org.findOne({'url': req.params.url}, function(err, org){
        if (err) return handler(err,res);
        if (!org) return notFound({'message': 'no such org'}, res);
        db.User.findOne({'handle': req.body.handle}, function(err, user) {
          if (err) return handler(err,res);
          if (!user) return notFound({'message': 'no such user'}, res);//!!
          var standing = new Standing({
            org: org.url,
            user: user.handle,
            isMember: req.body.isMember,
            isAdmin: req.body.isAdmin
          });
          standing.save(function(err, standing) {
            if (err) return handler(err, res);
            res.json(standing);
          });
        });
      });

    }
    else res.json({'message':'user exists', 'standing': standing});
  });


};

var getUser = function(req, res) {
  Standing.find({'user': req.params.handle}, 'org isMember', 
      function(err, standings){
    if (err) return handler(err,res);
    res.json(standings);
  });
};

var getOrg = function(req, res) {
  Standing.find({'org': req.params.url}, 'user isMember', 
      function(err, standings){
    if (err) return handler(err,res);
    res.json(standings);
  });
};


var get = function(req, res) {
  Standing.findOne({'org': req.params.url, 'user': req.params.handle}, 
      function(err, standing) {
    if (err) return handler(err,res);
    if (!standing) return notFound({'messge': 'no such standing'}, res);
    res.json(standing);
  });
};

var put = function(req, res) {
  Standing.findOne({'org': req.params.url, 'user': req.params.handle}, 
      '+', 
      function(err, standing) {
    if (err) return handler(err, res);
    if (!standing) return notFound({'message': 'no such standing'}, res);

    standing.isMember = req.body.isMember || standing.isMember;
    standing.isAdmin  = req.body.isAdmin  || standing.isAdmin;

    standing.save(function(err,standing) {
      if (err) return handler(err, res);
      res.json(standing);
    });
  });
};

var del = function(req, res) {
  Standing.findOneAndRemove({'org': req.params.url, 'user': req.params.handle}, 
      function(err) {
    if(err) return handler(err, res);
    res.json({ 'message': 'Successfully removed' });
  });
};


module.exports = {
  post: post,
  getUser: getUser,
  getOrg: getOrg,

  get: get,
  put: put,
  del: del
};
