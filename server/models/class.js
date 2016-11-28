// Class {
// Name
// Department
// Number
// Public
// Fall
// Spring
// Credit
// Preqs [class_ids]
// Average_gpa
// }

var mongoose = require('mongoose');

// Define our beer schema
var ClassSchema = new mongoose.Schema({
  name: String,
  department: String,
  crn: Number,
  fall: Boolean,
  spring: Boolean,
  credit: Number,
  prereqs: [Schema.Types.ObjectId],
  average_gpa: Number,
  public: {type: Boolean, default: true}
});

// Export the Mongoose model
module.exports = mongoose.model('Class', ClassSchema);
