var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
  "eventName": { type: String, require: true, unique: false },
  "date": { type: String, require: false, unique: false },
  "time": { type: String, require: false, unique: false },
  "location": { type: String, require: false, unique: false },
  "organizer": { type: String, require: false, unique: false },
  "attendees": { type: Array, require: false, unique: false},
  "things_needed": { type: Array, require: false, unique: false}
});

var Event = mongoose.model('Event',eventSchema);

module.exports = Event;
