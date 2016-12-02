// Major {
// Name
// }

var mongoose = require('mongoose');
require('mongoose-double')(mongoose);

var MajorSchema = new mongoose.Schema({
  name: { type : String, required : true }
});

module.exports = mongoose.model('Major', MajorSchema);
