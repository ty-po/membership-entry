var mongoose = require('mongoose');

var orgSchema = mongoose.Schema({
  name: String
})


module.exports = mongoose.model('Org', orgSchema);
