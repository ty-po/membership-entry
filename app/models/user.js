var mongoose  = require('mongoose');
var uniqueVal = require('mongoose-unique-validator');

var userSchema = mongoose.Schema({
  handle: { type: String, required: true, unique: true },
  name: String,
  card: { type: String, unique: true , sparse: true, select: false },
  email: { type: String, unique: true, sparse: true },
  created: { type: Date },
  auth:{ type: {
    password: String
  }, select: false }
})

userSchema.methods.test = function() {
  var text = this.name 
    ? "Hello "+ this.name
    : "No name set"
  console.log(text);
}

userSchema.plugin(uniqueVal);

module.exports = mongoose.model('User', userSchema);
