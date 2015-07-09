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
var isValidEventArray = function(res) {
  res.body.should.have.length[1];
};
var eventIsUpdated = function(res) {
  res.body.should.have.property("name", 'Better Name');
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
      it('should respond with events', function(done) {
        makeUser(testuser, function() {
          makeOrg(targetorg, function() {
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
            makeStanding(adminstanding, function() {
              makeEvent(targetevent, function() {
                request
                .get('/orgs/targetorg/events')
                .auth('testuser', 'password1234')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(isValidEventArray)
                .end(done)
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
            .get('/orgs/targetorg/events/' + id)
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
            .put('/orgs/targetorg/events/' + id)
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
            .delete('/orgs/targetorg/events/' + id)
            .expect(401, done)
          });
        });
      });
    });
  });
  describe('as user', function() {
    describe('GET', function() {
      it('should respond with event', function(done) {
        makeUser(testuser, function() {
          makeOrg(targetorg, function() {
            makeEvent(targetevent, function(id) {
              request
              .get('/orgs/targetorg/events/' + id)
              .auth('testuser', 'password1234')
              .expect('Content-Type', /json/)
              .expect(200)
              .expect(isValidEvent)
              .end(done)
            });
          });
        });
      });
    });
    describe('PUT', function() {
      it('should respond with unauthorized', function(done) {
        makeUser(testuser, function() {
          makeOrg(targetorg, function() {
            makeEvent(targetevent, function(id) {
              request
              .put('/orgs/targetorg/events/' + id)
              .auth('testuser', 'password1234')
              .send(eventupdate)
              .expect(401, done)
            });
          });
        });
      });
    });
    describe('DELETE', function() {
      it('should respond with unauthorized', function(done) {
        makeUser(testuser, function() {
          makeOrg(targetorg, function() {
            makeEvent(targetevent, function(id) {
              request
              .delete('/orgs/targetorg/events/' + id)
              .auth('testuser', 'password1234')
              .expect(401, done)
            });
          });
        });
      });
    });
  });
  describe('as member', function() {
    describe('GET', function() {
      it('should respond with event', function(done) {
        makeUser(testuser, function() {
          makeOrg(targetorg, function() {
            makeStanding(memberstanding, function() {
              makeEvent(targetevent, function(id) {
                request
                .get('/orgs/targetorg/events/' + id)
                .auth('testuser', 'password1234')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(isValidEvent)
                .end(done)
              });
            });
          });
        });
      });
    });
    describe('PUT', function() {
      it('should respond with unauthorized', function(done) {
        makeUser(testuser, function() {
          makeOrg(targetorg, function() {
            makeStanding(memberstanding, function() {
              makeEvent(targetevent, function(id) {
                request
                .put('/orgs/targetorg/events/' + id)
                .auth('testuser', 'password1234')
                .send(eventupdate)
                .expect(401, done)
              });
            });
          });
        });
      });
    });
    describe('DELETE', function() {
      it('should respond with unauthorized', function(done) {
        makeUser(testuser, function() {
          makeOrg(targetorg, function() {
            makeStanding(memberstanding, function() {
              makeEvent(targetevent, function(id) {
                request
                .delete('/orgs/targetorg/events/' + id)
                .auth('testuser', 'password1234')
                .expect(401, done)
              });
            });
          });
        });
      });
    });
  });
  describe('as admin', function() {
    describe('GET', function() {
      it('should respond with event', function(done) {
        makeUser(testuser, function() {
          makeOrg(targetorg, function() {
            makeStanding(adminstanding, function() {
              makeEvent(targetevent, function(id) {
                request
                .get('/orgs/targetorg/events/' + id)
                .auth('testuser', 'password1234')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(isValidEvent)
                .end(done)
              });
            });
          });
        });
      });
    });
    describe('PUT', function() {
      it('should update event', function(done) {
        makeUser(testuser, function() {
          makeOrg(targetorg, function() {
            makeStanding(adminstanding, function() {
              makeEvent(targetevent, function(id) {
                request
                .put('/orgs/targetorg/events/' + id)
                .auth('testuser', 'password1234')
                .send(eventupdate)
                .expect(200)
                .expect(eventIsUpdated)
                .end(done)
              });
            });
          });
        });
      });
    });
    describe('DELETE', function() {
      it('should remove event', function(done) {
        makeUser(testuser, function() {
          makeOrg(targetorg, function() {
            makeStanding(adminstanding, function() {
              makeEvent(targetevent, function(id) {
                request
                .delete('/orgs/targetorg/events/' + id)
                .auth('testuser', 'password1234')
                .expect(200, done)
              });
            });
          });
        });
      });
    });
  });
  describe('as owner', function() {
    describe('GET', function() {
      it('should respond with event', function(done) {
        makeUser(testuser, function() {
          makeOrg(ownedorg, function() {
            makeStanding(memberstanding, function() {
              makeEvent(targetevent, function(id) {
                request
                .get('/orgs/targetorg/events/' + id)
                .auth('testuser', 'password1234')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(isValidEvent)
                .end(done)
              });
            });
          });
        });
      });
    });
    describe('PUT', function() {
      it('should update event', function(done) {
        makeUser(testuser, function() {
          makeOrg(ownedorg, function() {
            makeStanding(memberstanding, function() {
              makeEvent(targetevent, function(id) {
                request
                .put('/orgs/targetorg/events/' + id)
                .auth('testuser', 'password1234')
                .send(eventupdate)
                .expect(200)
                .expect(eventIsUpdated)
                .end(done)
              });
            });
          });
        });
      });
    });
    describe('DELETE', function() {
      it('should remove event', function(done) {
        makeUser(testuser, function() {
          makeOrg(ownedorg, function() {
            makeStanding(memberstanding, function() {
              makeEvent(targetevent, function(id) {
                request
                .delete('/orgs/targetorg/events/' + id)
                .auth('testuser', 'password1234')
                .expect(200, done)
              });
            });
          });
        });
      });
    });
  });
});
