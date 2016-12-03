// School {
// Name
// majors
// Minors
// }

var mongoose = require('mongoose');
// require('mongoose-double')(mongoose);

var SchoolSchema = new mongoose.Schema({
  name: { type : String, required : true },
  majors: [ { type : mongoose.Schema.Types.ObjectId, ref : 'Major' } ],
  minors: [ { type : mongoose.Schema.Types.ObjectId, ref : 'Minor' } ],
});

module.exports = mongoose.model('School', SchoolSchema);
