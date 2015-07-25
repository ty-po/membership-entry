var mongoose = require('mongoose');

var attendSchema = mongoose.Schema({
  event:  { type: mongoose.Schema.Types.ObjectId, required: true},
  user:     { type: String, required: true },
  timeIn:   { type: Date, required: true },
  timeOut:  Date,
  flag:     { type: Boolean, default: false }
})

module.exports = mongoose.model('Attend', attendSchema);
