var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date },
  org:  { type: String, required: true }
})

module.exports = mongoose.model('Event', eventSchema);
