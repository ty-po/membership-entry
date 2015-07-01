var utils   = require('../utils.js');
var app     = require('../../server.js');
var request = require('supertest')(app);

var makeUser      = utils.makeUser;
var makeOrg       = utils.makeOrg;
var makeStanding  = utils.makeStanding;
var makeEvent     = utils.makeEvent;

var testuser        = { handle: 'testuser', password: 'password1234' }

var targetorg       = { url: 'targetorg', name: 'TestCo', ownerHandle: 'joseph' }
var ownedorg       = { url: 'targetorg', name: 'TestCo', ownerHandle: 'testuser' }

var memberstanding  = { url: 'targetorg', handle: 'testuser', isMember: true }
var adminstanding   = { url: 'targetorg', handle: 'testuser', isAdmin: true }

var targetevent     = { name: 'Quality Gathering', url: 'targetorg'}
var badevent        = { garbage: 2 }

var eventupdate     = { name: 'Better Name' }

var isValidEvent = function(res) {
  res.body.should.have.property("name");
  res.body.should.have.property("org");
};

describe('/orgs/:url/events', function() {
  describe('without auth', function() {
    describe('GET', function() {
      it('should respond with unauthorized', function(done) {
        makeOrg(targetorg, function() {
          makeEvent(targetevent, function() {
            request
            .get('/orgs/targetorg/events')
            .expect(401, done)
          });
        });
      });
    });
    describe('POST', function() {
      it('should respond with unauthorized', function(done) {
        makeOrg(targetorg, function() {
          request
          .post('/orgs/targetorg/events')
          .send(targetevent)
          .expect(401, done)
        });
      });
    });
  });
  describe('as user', function() {
    describe('GET', function() {
      it('should respond with unauthorized', function(done) {
        makeUser(testuser, function() {
          makeOrg(targetorg, function() {
            makeEvent(targetevent, function() {
              request
              .get('/orgs/targetorg/events')
              .auth('testuser', 'password1234')
              .expect(401, done)
            });
          });
        });
      });
    });
    describe('POST', function() {
      it('should respond with unauthorized', function(done) {
        makeUser(testuser, function() {
          makeOrg(targetorg, function() {
            request
            .post('/orgs/targetorg/events')
            .auth('testuser', 'password1234')
            .send(targetevent)
            .expect(401, done)
          });
        });
      });
    });
  });
  describe('as member', function() {
    describe('GET', function() {
      it('should respond with events', function(done) {
        makeUser(testuser, function() {
          makeOrg(targetorg, function() {
            makeStanding(memberstanding, function() {
              makeEvent(targetevent, function() {
                request
                .get('/orgs/targetorg/events')
                .auth('testuser', 'password1234')
                .expect('Content-Type', /json/)
                .expect(200, done)
              });
            });
          });
        });
      });
    });
    describe('POST', function() {
      it('should respond with unauthorized', function(done) {
        makeUser(testuser, function() {
          makeOrg(targetorg, function() {
            makeStanding(memberstanding, function() {
              request
              .post('/orgs/targetorg/events')
              .auth('testuser', 'password1234')
              .send(targetevent)
              .expect(401, done)
            });
          });
        });
      });
    });
  });
  describe('as admin', function() {
    describe('GET', function() {
      it('should respond with events', function(done) {
        makeUser(testuser, function() {
          makeOrg(targetorg, function() {
            makeStanding(memberstanding, function() {
              makeEvent(targetevent, function() {
                request
                .get('/orgs/targetorg/events')
                .auth('testuser', 'password1234')
                .expect('Content-Type', /json/)
                .expect(200, done)
              });
            });
          });
        });
      });
    });
    describe('POST', function() {
      it('should create and save event', function(done) {
        makeUser(testuser, function() {
          makeOrg(targetorg, function() {
            makeStanding(adminstanding, function() {
              request
              .post('/orgs/targetorg/events')
              .auth('testuser', 'password1234')
              .send(targetevent)
              .expect(200)
              .expect(isValidEvent)
              .end(done)
            });
          });
        });
      });
      it('should reject incomplete event', function(done) {
        makeUser(testuser, function() {
          makeOrg(targetorg, function() {
            makeStanding(adminstanding, function() {
              request
              .post('/orgs/targetorg/events')
              .auth('testuser', 'password1234')
              .send(badevent)
              .expect(500, done)
            });
          });
        });
      });
    });
  });
  describe('as owner', function() {
    describe('GET', function() {
      it('should respond with events', function(done) {
        makeUser(testuser, function() {
          makeOrg(ownedorg, function() {
            makeEvent(targetevent, function() {
              request
              .get('/orgs/targetorg/events')
              .auth('testuser', 'password1234')
              .expect('Content-Type', /json/)
              .expect(200, done)
            });
          });
        });
      });
    });
    describe('POST', function() {
      it('should create and save event', function(done) {
        makeUser(testuser, function() {
          makeOrg(ownedorg, function() {
            request
            .post('/orgs/targetorg/events')
            .auth('testuser', 'password1234')
            .send(targetevent)
            .expect(200)
            .expect(isValidEvent)
            .end(done)
          });
        });
      });
    });
  });
});

describe('/orgs/:url/events/:id', function() {
  describe('without auth', function() {
    describe('GET', function() {
      it('should respond with unauthorized', function(done) {
        makeOrg(targetorg, function() {
          makeEvent(targetevent, function(id) {
            request
            .get('/orgs/:url/events/' + id)
            .expect(401, done)
          });
        });
      });
    });
    describe('PUT', function() {
      it('should respond with unauthorized', function(done) {
        makeOrg(targetorg, function() {
          makeEvent(targetevent, function(id) {
            request
            .put('/orgs/:url/events/' + id)
            .send(eventupdate)
            .expect(401, done)
          });
        });
      });
    });
    describe('DELETE', function() {
      it('should respond with unauthorized', function(done) {
        makeOrg(targetorg, function() {
          makeEvent(targetevent, function(id) {
            request
            .delete('/orgs/:url/events/' + id)
            .expect(401, done)
          });
        });
      });
    });
  });
  describe('as user', function() {});
  describe('as member', function() {});
  describe('as admin', function() {});
  describe('as owner', function() {});
});
