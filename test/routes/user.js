var utils = require('../utils.js');
var express = require('express');
var app = require('../../server.js');
var request = require('supertest')(app);

var theTester = { handle: 'theTester', password: 'password1234' }
var failUser  = { handle: 'noPassword' }

describe('/users', function() {
  describe('with no authentication', function() {
    describe('GET', function() {
      it('should respond with unauthorized', function(done) {
        request
        .get('/users')
        .expect(401, done);
      });
    });
    describe('POST', function() {
      it('should create and save user', function(done) {
        request
        .post('/users')
        .send(theTester)
        .expect('Content-Type', /json/)
        .expect(200, done);
      });
      it('should reject duplicate user', function(done) {
        request
        .post('/users')
        .send(theTester)
        .expect('Content-Type', /json/)
        .expect(500, done);
      });
      it('should reject incomplete user', function(done) {
        request
        .post('/users')
        .send(failUser)
        .expect('Content-Type', /json/)
        .expect(500, done);
      });
    });
  });

  describe('as user', function() {
    describe('GET', function() {
      it('should return json array of all users', function(done) {
        request
        .get('/users')
        .auth('theTester', 'password1234')
        .expect('Content-Type', /json/)
        .expect(200, done);
      });
    });
  });
});

