var mongoose = require('mongoose');
var uniqueVal = require('mongoose-unique-validator');

var eventSchema = mongoose.Schema({
  name: String
})

eventSchema.plugin(uniqueVal);
module.exports = mongoose.model('Event', eventSchema);
