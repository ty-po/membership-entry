var db  = require('../db.js');
var Org = db.Org;

var error = require('../error.js').message;

var post = function(req, res) {
  var org = new Org({
  
  });
  org.save(function(err, org) {
    if (err) return error(err, res);
    res.json(org);
  });
};

var getAll = function(req, res) {
  Org.find({}, '', function(err, orgs){
    if (err) return error(err,res);
    res.json(orgs);
  });
};


var get = function(req, res) {
  Org.findOne({'': }, function(err, org) {
    if (err) return error(err,res);
    if (!org) return res.status(404).json({ 'message': 'no such org' });
    res.json(org);
  });
};

var put = function(req, res) {
  Org.findOne({'': }, '+', function(err, org) {
    if (err) return error(err, res);
    if (!org) return res.status(404).json({ 'message': 'no such org' });



    org.save(function(err,org) {
      if (err) return error(err, res);
      res.json(org);
    });
  });
};

var del = function(req, res) {
  Org.findOneAndRemove({'': }, function(err) {
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
