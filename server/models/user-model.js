var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  firstName: { type: String, require: true, unique: false },
  lastName: { type: String, require: true, unique: false },
  email: { type: String, require: true, unique: true },
  phoneNumber: {type: String, require: false, unique: false },
  smsOptIn: { type: Boolean, require: false, unique: false}
});

var User = mongoose.model('User',userSchema);

module.exports = User;
