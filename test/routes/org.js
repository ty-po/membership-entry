var utils = require('../utils.js');
var express = require('express');
var app = require('../../server.js');
var request = require('supertest')(app);

var makeUser    = utils.makeUser;
var makeOrg     = utils.makeOrg;

var testuser    = { handle: 'testuser', password: 'password1234' };

var testorg     = { url: 'testorg', name: 'Test LLC', ownerHandle: 'testuser' };
var targetorg   = { url: 'targetorg', name: 'Other Company', ownerHandle: 'joseph' };
var failOrg     = { url: 'dumco'};
var garbageOrg  = { url: '#swag', name: 'GAAHT EEEM' };

var orgUpdate = { name: "Better Name", ownerHandle: 'joseph' }

var isValidOrg = function(res) {
  res.body.should.have.property("url");
};

var isTargetOrg = function(res) {
  res.body.should.have.property("url", targetorg.url);
};

var isUpdated = function(res) {
  res.body.should.have.property("name", orgUpdate.name);
  res.body.should.have.property("ownerHandle", orgUpdate.ownerHandle);
};

describe('/orgs', function() {
  describe('without auth', function() {
    describe('GET', function() {
      it('should respond with unauthorized', function(done) {
        request
        .get('/orgs')
        .expect(401, done);
      });
    });
    describe('POST', function() {
      it('should respond with unauthorized', function(done) {
        request
        .post('/orgs')
        .send(testorg)
        .expect(401, done);
      });
    });
  });
  describe('as user', function() {
    describe('GET', function() {
      it('should respond with orgs', function(done) {
        makeUser(testuser, function() {
          request
          .get('/orgs')
          .auth('testuser', 'password1234')
          .expect('Content-Type', /json/)
          .expect(200, done);
        });
      });
    });
    describe('POST', function() {
      it('should create and save org', function(done) {
        makeUser(testuser, function() {
          request
          .post('/orgs')
          .auth('testuser', 'password1234')
          .send(testorg)
          .expect(200)
          .expect(isValidOrg)
          .end(done);
        });
      });
      it('should reject duplicate org', function(done) {
        makeOrg(testorg, function() {
          makeUser(testuser, function() {
            request
            .post('/orgs')
            .auth('testuser', 'password1234')
            .send(testorg)
            .expect('Content-Type', /json/)
            .expect(500, done)
          });
        });
      });
      it('should reject incomplete org', function(done) {
        makeUser(testuser, function() {
          request
          .post('/orgs')
          .auth('testuser', 'password1234')
          .send(failOrg)
          .expect('Content-Type', /json/)
          .expect(500, done)
        });
      });
      it('should reject non alpha-numeric url', function(done) {
        makeUser(testuser, function() {
          request
          .post('/orgs')
          .auth('testuser', 'password1234')
          .send(garbageOrg)
          .expect('Content-Type', /json/)
          .expect(500, done)
        });
      });
    });
  });
});

describe('/orgs/:url', function() {
  describe('without auth', function() {
    describe('GET', function() {
      it('should respond with unauthorized', function(done) {
        makeOrg(targetorg, function() {
          request
          .get('/orgs/targetorg')
          .expect(401, done);
        });
      });
    });
    describe('PUT', function() {
      it('should respond with unauthorized', function(done) {
        makeOrg(targetorg, function() {
          request
          .put('/orgs/targetorg')
          .send(orgUpdate)
          .expect(401, done);
        });
      });
    });
    describe('DELETE', function() {
      it('should respond with unauthorized', function(done) {
        makeOrg(targetorg, function() {
          request
          .delete('/orgs/targetorg')
          .expect(401, done);
        });
      });
    });
  });
  describe('as user', function() {
    describe('GET', function() {
      it('should respond with org', function(done) {
        makeOrg(targetorg, function() {
          makeUser(testuser, function() {
            request
            .get('/orgs/targetorg')
            .auth('testuser', 'password1234')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(isTargetOrg)
            .end(done)
          });
        });
      });
      it('should redirect to lower case', function(done) {
        makeOrg(targetorg, function() {
          makeUser(testuser, function() {
            request
            .get('/orgs/TargetOrg')
            .auth('testuser', 'password1234')
            .expect(301)
            .end(done);
          });
        });
      });
    });
    describe('PUT', function() {
      it('should respond with unauthorized', function(done) {
        makeOrg(targetorg, function() {
          makeUser(testuser, function() {
            request
            .put('/orgs/targetorg')
            .auth('testuser', 'password1234')
            .send(orgUpdate)
            .expect('Content-Type', /json/)
            .expect(401, done)
          });
        });
      });
    });
    describe('DELETE', function() {
      it('should respond with unauthorized', function(done) {
        makeOrg(targetorg, function() {
          makeUser(testuser, function() {
            request
            .delete('/orgs/targetorg')
            .auth('testuser', 'password1234')
            .expect('Content-Type', /json/)
            .expect(401, done)
          });
        });
      });
    });
  });
  describe('as owner', function() {
    describe('GET', function() {
      it('should respond with org', function(done) {
        makeOrg(testorg, function() {
          makeUser(testuser, function() {
            request
            .get('/orgs/testorg')
            .auth('testuser', 'password1234')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(isValidOrg)
            .end(done);
          });
        });
      });
    });
    describe('PUT', function() {
      it('should update org', function(done) {
        makeOrg(testorg, function() {
          makeUser(testuser, function() {
            request
            .put('/orgs/testorg')
            .auth('testuser', 'password1234')
            .send(orgUpdate)
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(isUpdated)
            .end(done);
          });
        });
      });
    });
    describe('DELETE', function() {
      it('should respond with unauthorized', function(done) {
        makeOrg(testorg, function() {
          makeUser(testuser, function() {
            request
            .delete('/orgs/testorg')
            .auth('testuser', 'password1234')
            .expect('Content-Type', /json/)
            .expect(200, done)
          });
        });
      });
    });
  });
});
