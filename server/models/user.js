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
// classes: [tuples of class_id, label_id, semester]
//
// }

var mongoose = require('mongoose');

var UserSchema   = new mongoose.Schema({
  facebookId: { type : String, required : true },
  //university: { type : mongoose.Schema.Types.ObjectId, ref : 'School' },
  university: { type : String },
  major: { type : String, default : "Unassigned" },
  minor: { type: String },
  totalSemesters: { type: Number, default: 8},
  currSemester: { type : Number, default: 1 },
  public: { type: Boolean, default : false },
  labels: [ { type : mongoose.Schema.Types.ObjectId, ref : 'Label' } ],
  classes: [ {
    classId: { type : mongoose.Schema.Types.ObjectId, ref : 'Class' , required : true },
    labelId: { type : mongoose.Schema.Types.ObjectId, ref : 'Label' , required : true },
    semester: { type : Number, default : 0 }
  } ]
});

module.exports = mongoose.model('User', UserSchema);
