var utils = require('../utils.js');
var express = require('express');
var app = require('../../server.js');
var request = require('supertest')(app);

describe('GET /users', function() {
  it('should respond with json, unauthorized', function(done) {
    request
      .get('/users')
      .expect(401, done)
  });
});
