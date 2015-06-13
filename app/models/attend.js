var mongoose = require('mongoose');

var attendSchema = mongoose.Schema({
  name: String,
  org: String
})


module.exports = mongoose.model('Attend', attendSchema);
