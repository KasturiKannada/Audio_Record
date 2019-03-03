var tlgApp = angular.module('tlgApp', ['ngRoute','LocalStorageModule','ngSanitize','ngCookies']);
tlgApp.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);

tlgApp.constant('apiUrl','http://192.168.0.13:9090/TLGApp')

tlgApp.service('authService',['$rootScope','$q','dataService', function( $rootScope, $q,dataService){
    var auth = {};
     
    auth.checkPermissionForView = function(view) {
        if (!view.requiresAuthentication) {
            return false;
        }
         
        return userHasPermissionForView(view);
    };
     
    var userHasPermissionForView = function(view){
        if(!dataService.isUserLoggedIn()){
            return false;
        }
        if(!view.roles || !view.roles.length){
            return true;
        }
        return auth.userHasPermission(view.roles);
    };
     
    auth.userHasPermission = function(roles){
        if(!dataService.isUserLoggedIn()){
            return false;
        }
        var found = false;
        angular.forEach(roles, function(role, index){
          $rootScope.userDetails=dataService.getUserDetails();
            if ($rootScope.userDetails.alignPlusRoles===role){
                found = true;
                return;
            }                        
        });
         
        return found;
    };
    return auth;
}]);

tlgApp.directive('permission', ['authService', function(authService) {
   return {
       restrict: 'A',
       scope: {
          permission: '='
       },
       link: function (scope, elem, attrs) {
                if (authService.userHasPermission(scope.permission)) {
                    $(elem).show();
                } else {
                    $(elem).hide();
                }
       }
   }
}]);

// routes
tlgApp.config(function ($routeProvider,$locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
    .when('/record', {
        templateUrl : 'pages/project/toolList.html',
        controller  : 'toolListController'
    })

    .otherwise({
       redirectTo: '/record'
   });
});
tlgApp.run(['$timeout', '$rootScope', '$window','dataService','authService', function($timeout, $rootScope, $window,dataService,authService) { 
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        var urlPaths = [];
        // urlPaths = next.split('#');
       //  if(authService.checkPermissionForView(next)){
       //    $rootScope.userDetails=dataService.getUserDetails();
       //  $rootScope.Username=$rootScope.userDetails.firstName + " " + $rootScope.userDetails.lastName;
       //       $('.main-header').css('display', 'block');
       //    $('.main-sidebar').css('display', 'block');
       //     var bg_color = "#222d32";
       //    $('.main-body-wrapper').css("background-color", bg_color);
       //      $rootScope.isLoginPage = true;
       //  }else{
       //      $('.main-header').css('display', 'none');
       //    $('.main-sidebar').css('display', 'none');
       //     $rootScope.isLoginPage = false;
       //       var bg_login_color = "#ecf0f5";
       //    $('.main-body-wrapper').css("background-color", bg_login_color);
       //      $window.location.href ='#/login'
       // }
   //     if (dataService.isUserLoggedIn()) {
   //      $rootScope.userDetails=dataService.getUserDetails();
   //      $rootScope.Username=$rootScope.userDetails.firstName + " " + $rootScope.userDetails.lastName;
   //  }else{
   //      $('.main-header').css('display', 'none');
   //        $('.main-sidebar').css('display', 'none');
   //         var bg_login_color = "#ecf0f5";
   //        $('.main-body-wrapper').css("background-color", bg_login_color);
   //     $window.location.href ='#/login'
   // }
});
}])
