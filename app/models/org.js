var mongoose = require('mongoose');
var uniqueVal = require('mongoose-unique-validator');

var orgSchema = mongoose.Schema({
  url:  { type: String, required: true, unique: true },
  name: { type: String, required: true },
  adminHandle: { type: String, required: true , select: false }
})

orgSchema.plugin(uniqueVal);
module.exports = mongoose.model('Org', orgSchema);
