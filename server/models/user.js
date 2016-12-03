// User {
// facebookId
// university
// name
// major
// minor
// public
// number of semesters
// current semester
// label: [label_ids]
// classes: [array of semesters [ class_ids]]
//
// }

var mongoose = require('mongoose');

var UserSchema   = new mongoose.Schema({
  facebookId: { type : String, required : true },
  //university: { type : mongoose.Schema.Types.ObjectId, ref : 'School' },
  university: { type : String },
  major: { type : String, default : "Unassigned" },
  minor: { type: String },
  totalSemesters: { type: Number },
  currSemester: { type : Number },
  public: { type: Boolean, default : false },
  labels: [ { type : mongoose.Schema.Types.ObjectId, ref : 'Label' } ],
  classes: [ { type : mongoose.Schema.Types.ObjectId, ref : 'Class' } ]
});

module.exports = mongoose.model('User', UserSchema);
