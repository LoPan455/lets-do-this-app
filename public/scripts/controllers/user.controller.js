ldtApp.controller('UserController',['DataFactory','$mdDialog','$mdMenu',function(DataFactory,$mdDialog,$mdMenu) {
  console.log('UserController instantiated');
  var self = this;
  this.testMessage = 'This is the User test message';
  self.userObject = DataFactory.userObject;
  self.userEvents = DataFactory.userEvents;
  self.newEventObject = {};
  self.status = ''; // holds the confirmation dialog text
  self.isLoggedIn = DataFactory.isLoggedIn;

  // DataFactory.getMyEvents();

  self.getSelectedEvent = function(eventId) {
    DataFactory.getBasicEventData(eventId);
  }

  self.logOut = function(){
    console.log('UserController LogOut function called');
    DataFactory.logOut();

  }
  self.logIn = function(){
    console.log('UserController LogOut function called');
    DataFactory.logIn();
  }

  self.newEventDialog = function($event) {
    console.log($event);
       var parentEl = angular.element(document.body);
       $mdDialog.show({
         parent: parentEl,
         targetEvent: $event,
         templateUrl: '/views/new-event-dialog.html',
         controller: 'NewEventController as ne',
         clickOutsideToClose: false,
         locals: {
           currentUser: self.userObject
         },
         bindToController: true
      });
    }



  self.openMenu = function($mdMenu, ev) {
    console.log('openMenu() called',$mdMenu,ev);
      originatorEv = ev;
      $mdMenu.open(ev);
    };


  self.addEvent = function(eventObject){
    angular.copy(eventObject,self.newEventObject);
    console.log('addEvent() called: ',self.newEventObject);
    DataFactory.addEvent(self.newEventObject);
  }

  self.showUserInfo = function(ev){
    console.log('showUserInfo() has been called',ev);
    $mdDialog.show({
      controller: 'UserInfoController as info',
      templateUrl: '/views/user-info-dialog.html',
      parent: angular.element(document.body),
      locals: {
           user: self.userObject
         },
      bindToController: true,
      clickOutsideToClose:true,
    })
  }

}]);
