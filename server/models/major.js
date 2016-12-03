// Major {
// Name
// }

var mongoose = require('mongoose');

var MajorSchema = new mongoose.Schema({
  name: { type : String, required : true }
});

module.exports = mongoose.model('Major', MajorSchema);
