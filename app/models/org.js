var mongoose  = require('mongoose');
var uniqueVal = require('mongoose-unique-validator');
var validate  = require('mongoose-validators')

var orgSchema = mongoose.Schema({
  url:  { type: String, required: true, unique: true, lowercase: true , validate: validate.isAlphanumeric()},
  name: { type: String, required: true },
  ownerHandle: { type: String, required: true , select: false, lowercase: true }
})

orgSchema.plugin(uniqueVal);
module.exports = mongoose.model('Org', orgSchema);
