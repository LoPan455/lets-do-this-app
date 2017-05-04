ldtApp.controller('HomeController', ['DataFactory','$location','$http', '$firebaseAuth','$mdDialog',function(DataFactory,$location,$http,$firebaseAuth,$mdDialog){
  var self = this;
  console.log('home controller running');
  self.testMessage = 'Hello World, this is the home controller test message';

}]); // end controller code block
