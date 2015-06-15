var mongoose = require('mongoose');

var standingSchema = mongoose.Schema({
  org:    {type: String, required: true},
  user:   {type: String, required: true},
  isMember: {type: Boolean, default: false},
  isAdmin:  {type: Boolean, default: false},
})

module.exports = mongoose.model('Standing', standingSchema);
