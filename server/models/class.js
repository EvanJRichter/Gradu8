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
require('mongoose-double')(mongoose);

// Define our beer schema
var ClassSchema = new mongoose.Schema({
  number: String,
  department: String,
  title: String,
  description: String,
  fall: Boolean,
  spring: Boolean,
  credit: Number,
  prereqs: [String],
  average_gpa: mongoose.Schema.Types.Double,
  public: {type: Boolean, default: true}
});

// Export the Mongoose model
module.exports = mongoose.model('Class', ClassSchema);
