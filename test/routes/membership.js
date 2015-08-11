var utils   = require('../utils.js');
var app     = require('../../server.js');
var request = require('supertest')(app);

var makeUser      = utils.makeUser;
var makeOrg       = utils.makeOrg;
var makeStanding  = utils.makeStanding;

var Seed          = utils.Seed;

var testuser    = Seed.testuser
var targetuser  = Seed.targetuser

var targetorg   = Seed.targetorg
var ownedorg    = Seed.ownedorg

var targetstanding  = Seed.targetstanding
var hiddenstanding  = { url: 'targetorg', handle: 'targetuser' }

var isValidStanding = function(res) {
  res.body.should.have.property("org");
  res.body.should.have.property("user");
};
var isValidStandingArray = function(res) {
  res.body.should.have.lengthOf(1);
};
var isEmptyStandingArray = function(res) {
  res.body.should.have.lengthOf(0);
};



 
describe('/users/:handle/membership/', function() {
  describe('GET', function() {
    describe('without auth', function() {
      it('should respond with unauthorized', function(done) {
        makeUser(testuser, function() {
          makeUser(targetuser, function() {
            makeOrg(targetorg, function() {
              makeStanding(targetstanding, function() {
                request
                .get('/users/targetuser/membership')
                .expect(401, done)
              });
            });
          });
        });
      });
    });
    describe('as user', function() {
      it('should respond with member standings', function(done) {
        makeUser(testuser, function() {
          makeUser(targetuser, function() {
            makeOrg(targetorg, function() {
              makeStanding(targetstanding, function() {
                request
                .get('/users/targetuser/membership')
                .auth('testuser', 'password1234')
                .expect('Content-Type', /json/)
                .expect(isValidStandingArray)
                .expect(200)
                .end(done)
              });
            });
          });
        });
      });
      it('should exclude non-member records', function(done) {
        makeUser(testuser, function() {
          makeUser(targetuser, function() {
            makeOrg(targetorg, function() {
              makeStanding(hiddenstanding, function() {
                request
                .get('/users/targetuser/membership')
                .auth('testuser', 'password1234')
                .expect('Content-Type', /json/)
                .expect(isEmptyStandingArray)
                .expect(200)
                .end(done)
              });
            });
          });
        });
      });
    });
  });
});
describe('/users/:handle/membership/:url', function() {
  describe('GET', function() {
    describe('without auth', function() {
      it('should respond with unauthorized', function(done) {
        makeUser(testuser, function() {
          makeUser(targetuser, function() {
            makeOrg(targetorg, function() {
              makeStanding(targetstanding, function() {
                request
                .get('/users/targetuser/membership/targetorg')
                .expect(401, done)
              });
            });
          });
        });
      });
    });
    describe('as user', function() {
      it('should respond with member standing', function(done) {
        makeUser(testuser, function() {
          makeUser(targetuser, function() {
            makeOrg(targetorg, function() {
              makeStanding(targetstanding, function() {
                request
                .get('/users/targetuser/membership/targetorg')
                .auth('testuser', 'password1234')
                .expect('Content-Type', /json/)
                .expect(isValidStanding)
                .expect(200)
                .end(done)
              });
            });
          });
        });
      });
      it('should 404 non-member standing', function(done) {
        makeUser(testuser, function() {
          makeUser(targetuser, function() {
            makeOrg(targetorg, function() {
              makeStanding(hiddenstanding, function() {
                request
                .get('/users/targetuser/membership/targetorg')
                .auth('testuser', 'password1234')
                .expect('Content-Type', /json/)
                .expect(404, done)
              });
            });
          });
        });
      });
    });
  });
});
describe('/orgs/:url/membership/', function() {
  describe('GET', function() {
    describe('without auth', function() {
      it('should respond with unauthorized', function(done) {
        makeUser(testuser, function() {
          makeUser(targetuser, function() {
            makeOrg(targetorg, function() {
              makeStanding(targetstanding, function() {
                request
                .get('/orgs/targetorg/membership')
                .expect(401, done)
              });
            });
          });
        });
      });
    });
    describe('as user', function() {
      it('should respond with member standings', function(done) {
        makeUser(testuser, function() {
          makeUser(targetuser, function() {
            makeOrg(targetorg, function() {
              makeStanding(targetstanding, function() {
                request
                .get('/orgs/targetorg/membership')
                .auth('testuser', 'password1234')
                .expect('Content-Type', /json/)
                .expect(isValidStandingArray)
                .expect(200)
                .end(done)
              });
            });
          });
        });
      });
      it('should exclude non-member standings', function(done) {
        makeUser(testuser, function() {
          makeUser(targetuser, function() {
            makeOrg(targetorg, function() {
              makeStanding(hiddenstanding, function() {
                request
                .get('/orgs/targetorg/membership')
                .auth('testuser', 'password1234')
                .expect('Content-Type', /json/)
                .expect(isEmptyStandingArray)
                .expect(200)
                .end(done)
              });
            });
          });
        });
      });
    });
  });
});
describe('/orgs/:url/membership/:handle', function() {
  describe('GET', function() {
    describe('without auth', function() {
      it('should respond with unauthorized', function(done) {
        makeUser(testuser, function() {
          makeUser(targetuser, function() {
            makeOrg(targetorg, function() {
              makeStanding(targetstanding, function() {
                request
                .get('/orgs/targetorg/membership/targetuser')
                .expect(401, done)
              });
            });
          });
        });
      });
    });
    describe('as user', function() {
      it('should respond with member standing', function(done) {
        makeUser(testuser, function() {
          makeUser(targetuser, function() {
            makeOrg(targetorg, function() {
              makeStanding(targetstanding, function() {
                request
                .get('/orgs/targetorg/membership/targetuser')
                .auth('testuser', 'password1234')
                .expect(isValidStanding)
                .expect(200)
                .end(done)
              });
            });
          });
        });
      });
      it('should 404 non-member standing', function(done) {
        makeUser(testuser, function() {
          makeUser(targetuser, function() {
            makeOrg(targetorg, function() {
              makeStanding(hiddenstanding, function() {
                request
                .get('/orgs/targetorg/membership/targetuser')
                .auth('testuser', 'password1234')
                .expect(404, done)
              });
            });
          });
        });
      });
    });
  });
});


