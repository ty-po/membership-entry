var db = require('../db.js');
var Attend = db.Attend;
var Event = db.Event;
var User  = db.User;

var error = require('../error.js');
var handler = error.message;
var notFound = error.notFound

var parser = require('./card.js').parser;


var post = function(req, res) {
  //User Claim/Validation Logic Here
  
  parser(req.body.card, function(body, err) {
    if (err) return handler(err, res)

    //Working Chunk \/\/
    //
    User.findOne({sid: body.sid},'+card' , function(err, user) {
      if(err) return handler(err, res);
      if(!user) {
        var user = new User({
          handle:   body.handle,
          sid:      body.sid,
          first:    body.first,
          last:     body.last,
          auth:     Math.random() //TODO: fix this
        });
        user.save(function(err, user) {
          if (err) return handler(err, res)
          if (process.env.NODE_ENV === 'test') console.log('\t\tUser Created')
        });
      }
      else if (!user.verified && !user.card) {
        if (user.first.toLowerCase() === body.first.toLowerCase() 
              || user.last.toLowerCase() === body.last.toLowerCase()) {
          user.card = req.body.card;
          user.verified = true;

          user.save(function(err, user) {
            if (err) return handler(err, res)
          if (process.env.NODE_ENV === 'test') console.log('\t\tUser Verified')
          });
        }
      }

      Event.findOne({_id: req.params.id}, function(err, event) {
        if(err) return handler(err,res);
        if(!event) return notFound({'message': 'no such event'}, res)
        Attend.findOne({ user: user.handle, eventID: req.params.id}, function(err, attend) {
          if(err) return handler(err,res);
          if(!attend) {
            var attend = new Attend({
              event: event._id,
              user: user.handle,
              timeIn: Date.now(),
              flag: req.body.flag
            });
            attend.save(function(err, attend) {
              if(err) return handler(err,res);
              res.json(attend)//TODO output user standing here + door rejection logic(or do client side?)
            });
          }
          else if (req.body.checkOut) {
            attend.timeOut = Date.now();

            attend.save(function(err, attend) {
              if(err) return handler(err,res);
              res.json({'message': 'Checked Out', 'attend': attend});
            }); 
          }
          else res.status(500).json({'message': 'Attend Record Exists','attend': attend})
        });
      });
    });
    //
    //Working Chunk ^^
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
    res.json(attend);//TODO: return standing info as well
  });
};
var put = function(req,res) { //Check Out?
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
