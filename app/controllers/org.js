var db  = require('../db.js');
var Org = db.Org;

var error = require('../error.js').message;

var post = function(req, res) {
  var org = new Org({
    url: req.body.url,
    name: req.body.name,
    ownerHandle: req.user.handle
  });
  org.save(function(err, org) {
    if (err) return error(err, res);
    res.json(org);
  });
};

var getAll = function(req, res) {
  Org.find({}, 'url name',function(err, orgs){
    if (err) return error(err,res);
    res.json(orgs);
  });
};


var get = function(req, res) {
  Org.findOne({'url': req.params.url}, function(err, org) {
    if (err) return error(err,res);
    if (!org) return res.status(404).json({ 'message': 'no such org' });
    res.json(org);
  });
};

var put = function(req, res) {
  Org.findOne({'url': req.params.url}, '+ownerHandle', function(err, org) {
    if (err) return error(err, res);
    if (!org) return res.status(404).json({ 'message': 'no such org' });

    org.name        = req.body.name         ||  org.name;
    org.ownerHandle = req.body.ownerHandle  ||  org.ownerHandle;

    org.save(function(err,org) {
      if (err) return error(err, res);
      res.json(org);
    });
  });
};

var del = function(req, res) {
  Org.findOneAndRemove({'url': req.params.url}, function(err) {
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
