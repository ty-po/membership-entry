var db = require('../db.js');
var Attend = db.Attend;
var Event = db.Event;
var User  = db.User;


var error = require('../error.js');
var handler = error.message;
var notFound = error.notFound

var post = function(req, res) {
  //User Claim/Validation Logic Here
  Attend.findOne({ user: req.body.handle, eventID: req.params.id}, function(err, attend) {
    if(err) return handler(err,res);
    if(!attend) {
      Event.findOne({_id: req.params.id}, function(err, event) {
        if(err) return handler(err,res);
        if(!event) return notFound({'message': 'no such event'}, res)
        User.findOne({}, function(err, user) {
          if(err) return handler(err, res);
          if(!user) return notFound({'message': 'no such user'}, res)
          var attend = new Attend({
            event: event._id,
            user: user.handle,
            timeIn: Date.now(),
            flag: req.body.flag
          });
          attend.save(function(err, attend) {
            if(err) return handler(err,res);
            res.json(attend)//TODO output user standing here?
          });
        });
      });
    }
    else res.status(500).json({'message': 'Attend Record Exists','attend': attend})
  });
};
var getAll = function(req, res) {
  Attend.find({event: req.params.id}, function(err, attends) {
    if(err) return handler(err, res);
    res.json(attends);
  });
};

var get = function(req, res) {
  Attend.findOne({event: req.params.id, user: req.params.handle}, function(err, attend) {
  if(err) return handler(err,res);
  if(!attend) return notFound({'message': 'no such attend'}, res)
    res.json(attend);
  });
};
var put = function(req,res) { //Check Out
  Attend.findOne({event: req.params.id, user: req.params.handle}, function(err, attend) {
  if(err) return handler(err,res);
  if(!attend) return notFound({'message': 'no such attend'}, res)

    attend.flag     =  req.body.flag || attend.flag;

    attend.save(function(err, attend) {
      if(err) return handler(err,res);
      res.json(attend);
    });
  });
};

module.exports = {
  post: post,
  getAll: getAll,

  get: get,
  put: put
};
