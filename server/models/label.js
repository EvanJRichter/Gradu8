// Label {
// title
// public
// color
// }

var mongoose = require('mongoose');

// Define our beer schema
var LabelSchema   = new mongoose.Schema({
  name: String,
  color: String,
  public: {type: Boolean, default: true}
});

// Export the Mongoose model
module.exports = mongoose.model('Label', LabelSchema);
