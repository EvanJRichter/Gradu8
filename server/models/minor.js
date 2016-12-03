// Minorr {
// Name
// }

var mongoose = require('mongoose');

var MinorSchema = new mongoose.Schema({
  name: { type : String, required : true }
});

module.exports = mongoose.model('Minor', MinorSchema);
