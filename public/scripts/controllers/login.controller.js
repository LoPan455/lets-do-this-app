ldtApp.controller('LoginController',['DataFactory','$location','$firebaseAuth',function(DataFactory,$location,$http,$firebaseAuth) {
  console.log('LoginController loaded');
  var self = this;
  self.showLoginButton = true;


self.logIn = function(){
  console.log('LoginController LogIn() function called');
  DataFactory.logIn();
  self.showLoginButton = false;
}



}]);
