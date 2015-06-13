var express = require('express');
var router = express.Router();

var db = require('./db.js')

router.route('/')
  .get(function(req, res) {
    res.send('index')
  })
  .post()
  .put();

router.route('/events')
  .get(function(req, res) {
    res.send('events')
  })
  .post()
  .put();

router.route('/users')
  .get(function(req, res) {
    res.send('users')
  })
  .post()
  .put();


module.exports = router;
