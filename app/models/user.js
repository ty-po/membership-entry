var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  name: String,
  org: String
})

userSchema.methods.test = function() {
  var text = this.name 
    ? "Hello "+ this.name
    : "No name set"
  console.log(greeting);
}

module.exports = mongoose.model('User', userSchema);
