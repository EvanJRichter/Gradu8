// Minorr {
// Name
// }

var mongoose = require('mongoose');
require('mongoose-double')(mongoose);

var MinorSchema = new mongoose.Schema({
  name: { type : String, required : true }
});

module.exports = mongoose.model('Minor', MinorSchema);
