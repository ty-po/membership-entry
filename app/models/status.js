var mongoose = require('mongoose');
var uniqueVal = require('mongoose-unique-validator');

var statusSchema = mongoose.Schema({
  name: String
})

statusSchema.plugin(uniqueVal);
module.exports = mongoose.model('Status', statusSchema);
