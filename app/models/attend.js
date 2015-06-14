var mongoose = require('mongoose');
var uniqueVal = require('mongoose-unique-validator');

var attendSchema = mongoose.Schema({
  name: String
})

attendSchema.plugin(uniqueVal);
module.exports = mongoose.model('Attend', attendSchema);
