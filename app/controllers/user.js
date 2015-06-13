var db = require('../db.js');


var post = function(req, res) {};
var getAll = function(req, res) {res.send('asdfasdf');};

var get = function(req, res) {res.send(req.params.handle);};
var put = function(req, res) {};
var del = function(req, res) {};


module.exports = {
  post: post,
  getAll: getAll,

  get: get,
  put: put,
  del: del
};
