var db  = require('../db.js');
var Org = db.Org;

var error = require('../error.js');
var handler = error.message;
var notFound = error.notFound;

var post = function(req, res) {
  var org = new Org({
    url: req.body.url,
    name: req.body.name,
    ownerHandle: req.user.handle
  });
  org.save(function(err, org) {
    if (err) return handler(err, res);
    res.json(org);
  });
};

var getAll = function(req, res) {
  Org.find({}, 'url name',function(err, orgs){
    if (err) return handler(err,res);
    res.json(orgs);
  });
};


var get = function(req, res) {
  Org.findOne({'url': req.params.url}, function(err, org) {
    if (err) return handler(err,res);
    if (!org) return notFound({ 'message': 'no such org' }, res);
    res.json(org);
  });
};

var put = function(req, res) {
  if(!res.locals.Owner) return res.status(401).json({'message': 'Not Your Organization'}); 
  Org.findOne({'url': req.params.url}, '+ownerHandle', function(err, org) {
    if (err) return handler(err, res);
    if (!org) return notFound({ 'message': 'no such org' }, res);

    org.name        = req.body.name         ||  org.name;
    org.ownerHandle = req.body.ownerHandle  ||  org.ownerHandle;

    org.save(function(err,org) {
      if (err) return handler(err, res);
      res.json(org);
    });
  });
};

var del = function(req, res) {
  if(!res.locals.Owner) return res.status(401).json({'message': 'Not Your Organization'});
  Org.findOneAndRemove({'url': req.params.url}, function(err) {
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
