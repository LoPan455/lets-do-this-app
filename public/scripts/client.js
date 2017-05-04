var ldtApp = angular.module('ldtApp', ['firebase','ngRoute','ngMaterial','ngMessages','ui.router']);

ldtApp.config(['$routeProvider',function($routeProvider) {
  //routes
    $routeProvider
        .when ('/home', {
          templateUrl: '/views/home-view.html',
          controller: 'HomeController',
          controllerAs: 'hc'
        })
        .when ('/event/:eventId', {
            templateUrl: '/views/event-view.html',
            controller: 'EventController',
            controllerAs: 'ec'
        })
        .when ('/organizer', {
            templateUrl: '/views/organizer-view.html',
            controller: 'OrganizerController',
            controllerAs: 'oc'
        })

        .when ('/user', {
          templateUrl: '/views/user-view.html',
          controller: 'UserController',
          controllerAs: 'uc'
        })

        .when('/login', {
          templateUrl: '/views/login-view.html',
          controller: 'LoginController',
          controllerAs: 'login'
        })

        .otherwise ({
            redirectTo: '/login'
        });
}]);

// ldtApp.config(['$stateProvider',function($stateProvider) {
//   $stateProvider
//   .state('event.detail', {
//           url: '/event/:id',
//           templateUrl: '/views/event-view.html',
//           controller: 'EventController',
//           controllerAs: 'ec'
//         });
// }]);
