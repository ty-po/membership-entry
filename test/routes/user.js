var utils = require('../utils.js');
var express = require('express');
var app = require('../../server.js');
var request = require('supertest')(app);

describe('/users - methods', function() {
  describe('GET', function() {
    it('should respond with unauthorized', function(done) {
      request
        .get('/users')
        .expect(401, done)
    });
  });
});

