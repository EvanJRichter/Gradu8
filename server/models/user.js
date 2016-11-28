// User {
// _id
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

// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var UserSchema   = new mongoose.Schema({
  name: String,
  major: {type: String, default: "Undecided"},
  minor: {type: String, default: ""},
  totalSemesters: Number,
  currSemester: Number,
  public: {type: Boolean, default: false},
  labels: [Schema.Types.ObjectId],
  classes: [[Schema.Types.ObjectId]]
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
