ldtApp.controller('InviteController',['DataFactory','$mdDialog',function(DataFactory,$mdDialog,eventData) {

  console.log('Inivite Controller running');
  var self = this;
  self.testMessage = 'This is the Inivite Controller test message';
  self.eventData = eventData;
  console.log("self.eventData is:",self.eventData);

  self.closeDialog = function() {
    $mdDialog.hide();
  }

  self.inviteAttendee = function(){
    console.log('IC eventId is: ',self.eventData);
    console.log('InviteController inviteAttendee called');
    $mdDialog.hide();
  }






}]);
