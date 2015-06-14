var mongoose = require('mongoose');

var attendSchema = mongoose.Schema({
  eventID:  { type: mongoose.Schema.Types.ObjectId, required: true},
  user:     { type: String, required: true },
  timeIn:   { type: Date, required: true },
  timeOut:  Date
})

module.exports = mongoose.model('Attend', attendSchema);
