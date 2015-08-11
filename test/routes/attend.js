var utils   = require('../utils.js');
var app     = require('../../server.js');
var request = require('supertest')(app);

var makeUser      = utils.makeUser;
var makeOrg       = utils.makeOrg;
var makeStanding  = utils.makeStanding;
var makeEvent     = utils.makeEvent;
var makeAttend    = utils.makeAttend;

var Seed          = utils.Seed

var testuser      = Seed.testuser
var targetuser    = Seed.targetuser

var targetorg     = Seed.targetorg

var targetevent   = Seed.targetevent

var memberstanding  = Seed.memberstanding

var testattend      = Seed.testattend
var targetattend    = Seed.targetattend

var attendupdate    = { flag: true }

var isValidAttend = function(res) {
  res.body.should.have.property('event');
  res.body.should.have.property('user');
  res.body.should.have.property('timeIn');
};
var isValidAttendArray = function(res) {
  res.body.should.have.lengthOf(1);
};
var isUpdated = function(res) {
  res.body.should.have.property('flag', true);
};

describe('POST - /orgs/:url/events/:id/', function() {
  describe('without auth', function() {
    it('should respond with unauthorized', function(done) {
      makeOrg(targetorg, function() {
        makeEvent(targetevent, function(id) {
          request
          .post('/orgs/targetorg/events/' + id)
          .send(targetattend)
          .expect(401, done)
        });
      });
    });
  });
  describe('as user', function() {
    it('should respond with unauthorized', function(done) {
      makeUser(testuser, function() {
        makeOrg(targetorg, function() {
          makeEvent(targetevent, function(id) {
            request
            .post('/orgs/targetorg/events/' + id)
            .auth('testuser', 'password1234')
            .send(targetattend)
            .expect(401, done)
          });
        }); 
      });
    });
  });
  describe('as member', function() {
    it('should create attend record', function(done) {
      makeUser(testuser, function() {
        makeOrg(targetorg, function() {
          makeStanding(memberstanding, function() {
            makeEvent(targetevent, function(id) {
              makeUser(targetuser, function() {
                request
                .post('/orgs/targetorg/events/' + id)
                .auth('testuser', 'password1234')
                .send(targetattend)
                .expect(200)
                .expect('Content-Type', /json/)
                .expect(isValidAttend)
                .end(done)
              });
            });
          });
        }); 
      });
    });
    //TODO: many more tests here for user creation
  });
});
describe('GET - /orgs/:url/events/:id/attends', function() {
  describe('without auth', function() {
    it('should respond with unauthorized', function(done) {
      makeOrg(targetorg, function() {
        makeEvent(targetevent, function(id) {
          var thisattend = { id: id, handle: targetattend.handle }
          makeAttend(thisattend, function() {
            request
            .get('/orgs/targetorg/events/' + id + '/attends')
            .expect(401, done)
          });
        });
      });
    });
  });
  describe('as user', function() {
    it('should respond with unauthorized', function(done) {
      makeUser(testuser, function() {
        makeOrg(targetorg, function() {
          makeEvent(targetevent, function(id) {
            var thisattend = { id: id, handle: targetattend.handle }
            makeAttend(thisattend, function() {
              request
              .get('/orgs/targetorg/events/' + id + '/attends')
              .auth('testuser', 'password1234')
              .expect(401, done)
            });
          });
        });
      });
    });
  });
  describe('as member', function() {
    it('should respond with attend records', function(done) {
      makeUser(testuser, function() {
        makeOrg(targetorg, function() {
          makeStanding(memberstanding, function() {
            makeEvent(targetevent, function(id) {
              var thisattend = { id: id, handle: targetattend.handle }
              makeAttend(thisattend, function() {
                request
                .get('/orgs/targetorg/events/' + id + '/attends')
                .auth('testuser', 'password1234')
                .expect(200)
                .expect('Content-Type', /json/)
                .expect(isValidAttendArray)
                .end(done)
              });
            });
          });
        });
      });
    });
  });
});
describe('GET - /orgs/:url/events/:id/attends/:handle', function() {
  describe('without auth', function() {
    it('should respond with unauthorized', function(done) {
      makeOrg(targetorg, function() {
        makeEvent(targetevent, function(id) {
          var thisattend = { id: id, handle: targetattend.handle }
          makeAttend(thisattend, function() {
            request
            .get('/orgs/targetorg/events/' + id + '/attends/targetuser')
            .expect(401, done)
          });
        });
      });
    });
  });
  describe('as user', function() {
    it('should respond with unauthorized', function(done) {
      makeUser(testuser, function() {
        makeOrg(targetorg, function() {
          makeEvent(targetevent, function(id) {
            var thisattend = { id: id, handle: targetattend.handle }
            makeAttend(thisattend, function() {
              request
              .get('/orgs/targetorg/events/' + id + '/attends/targetuser')
              .auth('testuser', 'password1234')
              .expect(401, done)
            });
          });
        });
      });
    });
  });
  describe('as member', function() {
    it('should respond with attend record', function(done) {
      makeUser(testuser, function() {
        makeOrg(targetorg, function() {
          makeStanding(memberstanding, function() {
            makeEvent(targetevent, function(id) {
              var thisattend = { id: id, handle: targetattend.handle }
              makeAttend(thisattend, function() {
                request
                .get('/orgs/targetorg/events/' + id + '/attends/targetuser')
                .auth('testuser', 'password1234')
                //.expect(200)
                //.expect('Content-Type', /json/)
                .expect(isValidAttend)
                .end(done)
              });
            });
          });
        });
      });
    });
  });
});
describe('PUT - /orgs/:url/events/:id/attends/:handle', function() {
  describe('without auth', function() {
    it('should respond with unauthorized', function(done) {
      makeOrg(targetorg, function() {
        makeEvent(targetevent, function(id) {
          var thisattend = { id: id, handle: targetattend.handle }
          makeAttend(thisattend, function() {
            request
            .put('/orgs/targetorg/events/' + id + '/attends/targetuser')
            .send(attendupdate)
            .expect(401, done)
          });
        });
      });
    });
  });
  describe('as user', function() {
    it('should respond with unauthorized', function(done) {
      makeUser(testuser, function() {
        makeOrg(targetorg, function() {
          makeEvent(targetevent, function(id) {
            var thisattend = { id: id, handle: targetattend.handle }
            makeAttend(thisattend, function() {
              request
              .put('/orgs/targetorg/events/' + id + '/attends/targetuser')
              .auth('testuser', 'password1234')
              .send(attendupdate)
              .expect(401, done)
            });
          });
        });
      });
    });
  });
  describe('as member', function() {
    it('should respond with attend record', function(done) {
      makeUser(testuser, function() {
        makeOrg(targetorg, function() {
          makeStanding(memberstanding, function() {
            makeEvent(targetevent, function(id) {
              var thisattend = { id: id, handle: targetattend.handle }
              makeAttend(thisattend, function() {
                request
                .put('/orgs/targetorg/events/' + id + '/attends/targetuser')
                .auth('testuser', 'password1234')
                .send(attendupdate)
                .expect(200)
                .expect('Content-Type', /json/)
                .expect(isUpdated)
                .end(done)
              });
            });
          });
        });
      });
    });
  });
});
