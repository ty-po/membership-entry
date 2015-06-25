var utils = require('../utils.js');
var express = require('express');
var app = require('../../server.js');
var request = require('supertest')(app);

var makeUser = utils.makeUser;

var testUser = { handle: 'testUser', password: 'password1234' }
var failUser  = { handle: 'noPassword' }
var userUpdate = { first: 'Tes', last: 'Ter' }
var targetUser = { handle : 'targetUser', password: 'asdf' }

var isValidUser = function(res) {
  res.body.should.have.property("handle", testUser.handle);
};

var isUpdated = function(res) {
  res.body.should.have.property("first", userUpdate.first);
  res.body.should.have.property("last", userUpdate.last);
};

describe('/users', function() {
  describe('without auth', function() {
    describe('GET', function() {
      it('should respond with unauthorized', function(done) {
        request
        .get('/users')
        .expect(401, done);
      });
    });
    describe('POST', function() {
      it('should create and save user(s)', function(done) {
        request
        .post('/users')
        .send(testUser)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(isValidUser)
        .end(done);
      });
      it('should reject duplicate user', function(done) {
        makeUser(testUser, function() {
          request
          .post('/users')
          .send(testUser)
          .expect('Content-Type', /json/)
          .expect(500, done); 
        });
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
      it('should reject incorrect password', function(done) {
        makeUser(testUser, function() {
          request
          .get('/users')
          .auth('testUser', 'wrong')
          .expect(401, done);
        });
      });
      it('should reject non-existent user', function(done) {
        makeUser(testUser, function() {
          request
          .get('/users')
          .auth('noPassword', 'password1111')
          .expect(401, done);
        });
      });
      it('should accept auth and return json', function(done) {
        makeUser(testUser, function() {
          request
          .get('/users')
          .auth('testUser', 'password1234')
          .expect('Content-Type', /json/)
          .expect(200, done);
        });
      });
    });
  });
});

describe('/users/:handle', function() {
  describe('without auth', function() {
    describe('GET', function() {
      it('should respond with unauthorized', function(done) {
        makeUser(targetUser, function() {
          request
          .get('/users/targetUser')
          .expect(401, done);
        });
      });
    });
    describe('PUT', function() {
      it('should respond with unauthorized', function(done) {
        makeUser(targetUser, function() {
          request
          .put('/users/targetUser')
          .send(userUpdate)
          .expect(401, done);
        });
      });
    });
    describe('DELETE', function() {
      it('should respond with unauthorized', function(done) {
        makeUser(targetUser, function() {
          request
          .delete('/users/targetUser')
          .expect(401, done);
        });
      });
    });
  });
  describe('as user', function() {
    describe('GET', function() {
      it('should respond with user', function(done) {
        makeUser(targetUser, function() {
          makeUser(testUser, function() {
            request
            .get('/users/targetUser')
            .auth('testUser', 'password1234')
            .expect('Content-Type', /json/)
            .expect(200, done);
          });
        });
      });
    });
    describe('PUT', function() {
      it('should respond with unauthorized', function(done) {
        makeUser(targetUser, function() {
          makeUser(testUser, function() {
            request
            .put('/users/targetUser')
            .auth('testUser', 'password1234')
            .send(userUpdate)
            .expect(401, done);
          });
        });
      });
    });
    describe('DELETE', function() {
      it('should respond with unauthorized', function(done) {
        makeUser(targetUser, function() {
          makeUser(testUser, function() {
            request
            .delete('/users/targetUser')
            .auth('testUser', 'password1234')
            .expect(401, done);
          });
        });
      });
    });
  });
  describe('as me', function() {
    describe('GET', function() {
      it('should respond with user', function(done) {
        makeUser(testUser, function() {
          request
          .get('/users/testUser')
          .auth('testUser', 'password1234')
          .expect('Content-Type', /json/)
          .expect(200, done);
          });
      });
    });
    describe('PUT', function() {
      it('should update user', function(done) {
        makeUser(testUser, function() {
          request
          .put('/users/testUser')
          .auth('testUser', 'password1234')
          .send(userUpdate)
          .expect(200)
          .expect(isUpdated)
          .end(done);
        });
      });
    });
    describe('DELETE', function() {
      it('should delete user (and re-instantiate)', function(done) {
        makeUser(testUser, function() {
          request
          .delete('/users/testUser')
          .auth('testUser', 'password1234')
          .expect(200, done);
        });
      });
    });
  });
});
