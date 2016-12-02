// Class {
// Name
// Department
// Number
// Public
// Fall
// Spring
// Credits
// Prereqs [class_ids]
// Average_gpa
// }

var mongoose = require('mongoose');
//require('mongoose-double')(mongoose);

var ClassSchema = new mongoose.Schema({
  number: { type : Number, required : true },
  department: { type : String, required : true },
  title: { type : String, required : true },
  description: String,
  fall: Boolean,
  spring: Boolean,
  credits: { type : Number, required : true },
  prereqs: [ { type : mongoose.Schema.Types.ObjectId, ref : 'Class' } ],
  //average_gpa: mongoose.Schema.Types.Double,
  average_gpa: Number,
  public: {type: Boolean, default: true }
});

module.exports = mongoose.model('Class', ClassSchema);
