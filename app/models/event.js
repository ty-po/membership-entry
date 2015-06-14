var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
  name: { type: String, required: true },
  org:  { type: String, required: true }
})

module.exports = mongoose.model('Event', eventSchema);
