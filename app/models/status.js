var mongoose = require('mongoose');

var statusSchema = mongoose.Schema({
  org:    {type: String, required: true},
  user:   {type: String, required: true},
  status: {
    isMember: Boolean,
    isAdmin:  Boolean,
    type:     Number
  }
})

module.exports = mongoose.model('Status', statusSchema);
