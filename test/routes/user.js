var utils = require('../utils.js');
var express = require('express');
var app = require('../../server.js');
var request = require('supertest')(app);

var makeUser = utils.makeUser;

var testuser = { handle: 'testuser', password: 'password1234' }
var failUser  = { handle: 'noPassword' }
var garbageUser  = { handle: '~~~??@@##YAAAAxxx', password: 'pass' }
var userUpdate = { first: 'Tes', last: 'Ter' }
var targetuser = { handle : 'targetuser', password: 'asdf' }

var isValidUser = function(res) {
  res.body.should.have.property("handle");
};

var isTargetUser = function(res) {
  res.body.should.have.property("handle", targetuser.handle);
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
      it('should create and save user', function(done) {
        request
        .post('/users')
        .send(testuser)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(isValidUser)
        .end(done);
      });
      it('should reject duplicate user', function(done) {
        makeUser(testuser, function() {
          request
          .post('/users')
          .send(testuser)
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
      it('should reject non alpha-numeric handle', function(done) {
        request
        .post('/users')
        .send(garbageUser)
        .expect('Content-Type', /json/)
        .expect(500, done);
      });
      //TODO: many more user creation tests here
    });
  });

  describe('as user', function() {
    describe('GET', function() {
      it('should reject incorrect password', function(done) {
        makeUser(testuser, function() {
          request
          .get('/users')
          .auth('testuser', 'wrong')
          .expect(401, done);
        });
      });
      it('should reject non-existent user', function(done) {
        makeUser(testuser, function() {
          request
          .get('/users')
          .auth('noPassword', 'password1111')
          .expect(401, done);
        });
      });
      it('should accept auth and return json', function(done) {
        makeUser(testuser, function() {
          request
          .get('/users')
          .auth('testuser', 'password1234')
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
        makeUser(targetuser, function() {
          request
          .get('/users/targetuser')
          .expect(401, done);
        });
      });
    });
    describe('PUT', function() {
      it('should respond with unauthorized', function(done) {
        makeUser(targetuser, function() {
          request
          .put('/users/targetuser')
          .send(userUpdate)
          .expect(401, done);
        });
      });
    });
    describe('DELETE', function() {
      it('should respond with unauthorized', function(done) {
        makeUser(targetuser, function() {
          request
          .delete('/users/targetuser')
          .expect(401, done);
        });
      });
    });
  });
  describe('as user', function() {
    describe('GET', function() {
      it('should respond with user', function(done) {
        makeUser(targetuser, function() {
          makeUser(testuser, function() {
            request
            .get('/users/targetuser')
            .auth('testuser', 'password1234')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(isTargetUser)
            .end(done);
          });
        });
      });
      it('should redirect to lower case', function(done) {
        makeUser(targetuser, function() {
          makeUser(testuser, function() {
            request
            .get('/users/TargetUser')
            .auth('testuser', 'password1234')
            .expect(301)
            .end(done);
          });
        });
      });
    });
    describe('PUT', function() {
      it('should respond with unauthorized', function(done) {
        makeUser(targetuser, function() {
          makeUser(testuser, function() {
            request
            .put('/users/targetuser')
            .auth('testuser', 'password1234')
            .send(userUpdate)
            .expect(401, done);
          });
        });
      });
    });
    describe('DELETE', function() {
      it('should respond with unauthorized', function(done) {
        makeUser(targetuser, function() {
          makeUser(testuser, function() {
            request
            .delete('/users/targetuser')
            .auth('testuser', 'password1234')
            .expect(401, done);
          });
        });
      });
    });
  });
  describe('as me', function() {
    describe('GET', function() {
      it('should respond with user', function(done) {
        makeUser(testuser, function() {
          request
          .get('/users/testuser')
          .auth('testuser', 'password1234')
          .expect('Content-Type', /json/)
          .expect(200)
          .expect(isValidUser)
          .end(done);
          });
      });
    });
    describe('PUT', function() {
      it('should update user', function(done) {
        makeUser(testuser, function() {
          request
          .put('/users/testuser')
          .auth('testuser', 'password1234')
          .send(userUpdate)
          .expect(200)
          .expect(isUpdated)
          .end(done);
        });
      });
    });
    describe('DELETE', function() {
      it('should delete user', function(done) {
        makeUser(testuser, function() {
          request
          .delete('/users/testuser')
          .auth('testuser', 'password1234')
          .expect(200, done);
        });
      });
    });
  });
});
