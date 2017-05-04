ldtApp.controller('EventController',['DataFactory','$location','$http', '$firebaseAuth','$mdDialog',function(DataFactory,$location,$http,$firebaseAuth,$mdDialog) {
  console.log('EventController loaded');
  var self = this;
  self.eventObject = DataFactory.eventObject
  self.attendees = [];
  self.eventOrganizers = DataFactory.eventOrganizers;
  self.eventAttendees = DataFactory.eventAttendees;
  self.claimedThings = DataFactory.claimedThings;
  self.unclaimedThings = DataFactory.unclaimedThings;
  self.currentUserEmail = DataFactory.currentUserEmail;
  self.currentUser = DataFactory.currentUser;
  self.editEventData = false;
  self.newAttendee = {};
  self.thingToAdd = {};

console.log('self.eventObject is',self.eventObject);


//grab the value of the URL.
var uri = $location.url() //pulls the URL of the browser address bar


var eventId = uri.replace('/event/', '' ); //sets the eventId to lookup as per the URL
var auth = $firebaseAuth();

// fire up all the functions on page auth state change
auth.$onAuthStateChanged(viewInit);

/* Function Definitions */

function viewInit(){
  DataFactory.getBasicEventData(eventId);
  DataFactory.getOrganizers(eventId);
  DataFactory.getAttendees(eventId);
  DataFactory.getThingsForEvent(eventId);
  DataFactory.getUnclaimedThingsForEvent(eventId);
}

self.claimThing = function(eventId,thing,claimer){
  DataFactory.claimThing(eventId,thing,claimer);
  DataFactory.getThingsForEvent(eventId);
  DataFactory.getUnclaimedThingsForEvent(eventId);
}

self.unclaimThing = function(eventId,thing){
  DataFactory.unclaimThing(eventId,thing);
  DataFactory.getThingsForEvent(eventId);
  DataFactory.getUnclaimedThingsForEvent(eventId);
}

self.addThing = function(eventId,thing){
  console.log('self.addThing(thing)clicked',eventId, thing);
  DataFactory.addThing(eventId,thing);
  self.thingToAdd = {};
}

self.deleteEvent = function(eventId){
  DataFactory.deleteEvent(eventId);
}

self.editEvent = function(){
  self.editEventData = true;
}

self.saveEditedData = function() {
  DataFactory.updateEventData(self.eventObject);
  self.editEventData = true;
}

self.closeEvent = function() {
  $location.url('/user');
}

self.cancelEventEdit = function() {
  self.editEventData = false;
}

self.inviteAttendee = function(newAttendee){
  newAttendee.eventId = self.eventObject.eventData._id;
  newAttendee.eventUrl = $location.url();
  console.log('self.inviteAttendee()called with:',newAttendee);
  DataFactory.inviteAttendee(newAttendee);
  self.newAttendee = {};
  viewInit();
}

}]);
