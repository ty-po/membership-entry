var mongoose = require('mongoose');

var statusSchema = mongoose.Schema({
  name: String,
  org: String
})


module.exports = mongoose.model('Status', statusSchema);
