
var utils   = require('../utils.js');
var app     = require('../../server.js');
var request = require('supertest')(app);

var makeUser      = utils.makeUser;
var makeOrg       = utils.makeOrg;
var makeStanding  = utils.makeStanding;

var testuser        = { handle: 'testuser', password: 'password1234' }
var targetuser      = { handle: 'targetuser', password:'111111' }

var testorg         = { url: 'testorg', name: 'Test', ownerHandle: 'testuser' }
var targetorg       = { url: 'targetorg', name: 'OtherCO', ownerHandle: 'targetuser' }
var adminorg        = { url: 'adminorg', name: 'E', ownerHandle: 'joseph' }
var memberorg       = { url: 'memberorg', name: 'Club1', ownerHandle: 'joseph' }

var teststanding    = { url: 'testorg', handle: 'targetuser' , isMember: true}
var targetstanding  = { url: 'targetorg', handle: 'testuser' }
var adminstanding   = { url: 'adminorg', handle: 'testuser', isAdmin: true }
var memberstanding  = { url: 'memberorg', handle: 'testuser', isMember: true }

var admintargetstanding = { url: 'adminorg', handle: 'targetuser', isMember: true };

var userIsMember = function(res) {
  res.body.should.have.property("isMember", true);
};
var userIsAdmin = function(res) {
  res.body.should.have.property("isAdmin", true);
};

describe('/orgs/:url/users', function() {
  describe('without auth', function() {
    describe('GET', function() {
      it('should respond with unauthorized', function(done) {
        makeOrg(targetorg, function() {
          request
          .get('/orgs/targetorg/users')
          .expect(401, done);
        });
      });
    });
    describe('POST', function() {
      it('should respond with unauthorized', function(done) {
        makeUser(targetuser, function() {
          makeOrg(testorg, function() {
            request
            .post('/orgs/targetorg/users')
            .send(teststanding)
            .expect(401, done);
          });
        });
      });
    });
  });
  describe('as user', function() {
    describe('GET', function() {
      it('should respond with standings', function(done) {
        makeUser(testuser, function() {
          makeOrg(targetorg, function() {
            makeStanding(targetstanding, function() {
              request
              .get('/orgs/targetorg/users')
              .auth('testuser', 'password1234')
              .expect('Content-Type', /json/)
              .expect(200, done);
            });
          });
        });
      });
    });
    describe('POST', function() {
      it('should respond with unauthorized', function(done) {
        makeUser(testuser, function() {
          makeOrg(targetorg, function() {
            makeStanding(targetstanding, function() {
              request
              .post('/orgs/targetorg/users')
              .auth('testuser', 'password1234')
              .expect(401, done);
            });
          });
        });
      });
    });
  });
  describe('as member', function() {
    describe('GET', function() {
      it('should respond with standings', function(done) {
        makeUser(testuser, function() {
          makeOrg(memberorg, function() {
            makeStanding(memberstanding, function() {
              request
              .get('/orgs/memberorg/users')
              .auth('testuser', 'password1234')
              .expect('Content-Type', /json/)
              .expect(200, done);
            });
          });
        });
      });
    });
    describe('POST', function() {
      it('should respond with unauthorized', function(done) {
        makeUser(testuser, function() {
          makeOrg(memberorg, function() {
            makeStanding(memberstanding, function() {
              request
              .post('/orgs/memberorg/users')
              .auth('testuser', 'password1234')
              .expect(401, done);
            });
          });
        });
      });
    });
  });
  describe('as admin', function() {
    describe('GET', function() {
      it('should respond with standings', function(done) {
        makeUser(testuser, function() {
          makeOrg(adminorg, function() {
            makeStanding(adminstanding, function() {
              request
              .get('/orgs/adminorg/users')
              .auth('testuser', 'password1234')
              .expect('Content-Type', /json/)
              .expect(200, done);
            });
          });
        });
      });
    });
    describe('POST', function() {
      it('should create new standing', function(done) {
        makeUser(testuser, function() {
          makeUser(targetuser, function() {
            makeOrg(adminorg, function() {
              makeStanding(adminstanding, function() {
                request
                .post('/orgs/adminorg/users')
                .auth('testuser', 'password1234')
                .send(admintargetstanding)
                .expect(200)
                .expect(userIsMember)
                .end(done)
              });
            });
          });
        });
      });
      it('should reject duplicate standing', function(done) {
        makeUser(testuser, function() {
          makeUser(targetuser, function() {
            makeOrg(adminorg, function() {
              makeStanding(adminstanding, function() {
                request
                .post('/orgs/adminorg/users')
                .auth('testuser', 'password1234')
                .send(adminstanding)
                .expect(500, done);
              });
            });
          });
        });
      });
      it('should reject nonexistent user', function(done) {
        makeUser(testuser, function() {
          makeOrg(adminorg, function() {
            makeStanding(adminstanding, function() {
              request
              .post('/orgs/adminorg/users')
              .auth('testuser', 'password1234')
              .send(admintargetstanding)
              .expect(404, done);
            });
          });
        });
      });

    });
  });
  describe('as owner', function() {
    describe('GET', function() {
      it('should respond with standings', function(done) {
        makeUser(testuser, function() {
          makeOrg(testorg, function() {
            makeStanding(teststanding, function() {
              request
              .get('/orgs/testorg/users')
              .auth('testuser', 'password1234')
              .expect('Content-Type', /json/)
              .expect(200, done);
            });
          });
        });
      });
    });
    describe('POST', function() {
      it('should create new standing', function(done) {
        makeUser(testuser, function() {
          makeUser(targetuser, function() {
            makeOrg(testorg, function() {
              request
              .post('/orgs/testorg/users')
              .auth('testuser', 'password1234')
              .send(teststanding)
              .expect(200)
              .expect(userIsMember)
              .end(done);
            });
          });
        });
      });
    });
  });
});


describe('/orgs/:url/users/:handle', function() {

});


describe('/users/:handle/orgs', function() {

});


describe('/users/:handle/orgs/:url', function() {

});
