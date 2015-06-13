var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
  name: String,
  org: String
})


module.exports = mongoose.model('Event', eventSchema);
