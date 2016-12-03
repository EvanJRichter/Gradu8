// Label {
// name
// public
// color
// }

var mongoose = require('mongoose');

var LabelSchema   = new mongoose.Schema({
  name: String,
  color: String,
  public: { type : Boolean, default : true }
});

module.exports = mongoose.model('Label', LabelSchema);
