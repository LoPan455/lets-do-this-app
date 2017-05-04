ldtApp.controller('NewEventController',['DataFactory','$mdDialog',function(DataFactory,$mdDialog,currentUser) {

  console.log('NewEventController running');
  var self = this;
  self.testMessage = 'This is the NewEvent test message';
  self.newEventObject = { things: [] };

  self.submitNewEvent = function(newEventObject){
    console.log('The object we will send is:',newEventObject);
    DataFactory.addEvent(newEventObject);
    self.newEventObject= { things: [] };
    $mdDialog.hide();
  }


  self.closeDialog = function($event){
    $mdDialog.cancel('user cancelled');
  }

}]);
