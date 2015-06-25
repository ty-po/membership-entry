var mongoose  = require('mongoose');
var uniqueVal = require('mongoose-unique-validator');
var validate = require('mongoose-validators');
var bcrypt    = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10;

var userSchema = mongoose.Schema({
  handle: { type: String, required: true, unique: true, lowercase: true, validate: validate.isAlphanumeric() },
  first: String,
  last: String,
  card: { type: String, unique: true , sparse: true, select: false },
  email: { type: String, unique: true, sparse: true },
  created: { type: Date },
  auth:{ type: String, required: true, select: false }
});


userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('auth')) { return next(); }

  bcrypt.genSalt(5, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.auth, salt, null, function(err, hash) {
      if (err) return next(err);
      user.auth = hash;
      next();
    });
  });
});

userSchema.methods.verifyAuth = function(auth, cb) {
  var user = this;
  return cb(null, bcrypt.compareSync(auth, user.auth));
};


userSchema.plugin(uniqueVal);

module.exports = mongoose.model('User', userSchema);
