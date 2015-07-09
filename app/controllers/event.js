var db  = require('../db.js');
var Event = db.Event;

var error = require('../error.js');
var handler = error.message;
var notFound = error.notFound;

var post = function(req, res) {
  var event = new Event({
    name: req.body.name,
    org: req.params.url,
  });
  event.save(function(err, event) {
    if (err) return handler(err, res);
    res.json(event);
  });
};

var getAll = function(req, res) {
  Event.find({'org': req.params.url}, 'name', function(err, events) {
    if (err) return handler(err,res);
    res.json(events);
  });
};


var get = function(req, res) {
  Event.findOne({'_id': req.params.id, 'org': req.params.url }, function(err, event) {
    if (err) return handler(err,res);
    if (!event) return notFound({ 'message': 'no such event' }, res);
    res.json(event);
  });
};

var put = function(req, res) {
  Event.findOne({'_id': req.params.id }, '+', function(err, event) {
    if (err) return handler(err, res);
    if (!event) return notFound({ 'message': 'no such event' }, res);
    event.name = req.body.name || event.name;


    event.save(function(err,event) {
      if (err) return handler(err, res);
      res.json(event);
    });
  });
};

var del = function(req, res) {
  Event.findOneAndRemove({'_id': req.params.id}, function(err) {
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
