var gradu8Controllers = angular.module('gradu8Controllers', []);

gradu8Controllers.controller('LandingController', ['$scope', 'srvAuth', '$location', function($scope, CommonData, srvAuth, $location) {
  $scope.fb_login = function() {
    FB.login(function(response) {
      if (response.authResponse) {
        $location.path( "/create_profile" );
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    }, { scope: 'email,public_profile' });
  };

  $scope.logout = function(){
    srvAuth.logout();
    $scope.displayText = "Logged out"
  };

}]);

gradu8Controllers.controller('CreateProfileController', ['$scope', 'Users', function($scope, Users) {

}]);

gradu8Controllers.controller('AddClassesController', ['$scope', 'Users', 'Classes', 'Labels', function($scope, Users, Classes, Labels) {

}]);

gradu8Controllers.controller('CalendarController', ['$scope', 'Users', 'Classes', 'Labels', function($scope, Users, Classes, Labels) {

}]);

gradu8Controllers.controller('EditProfileController', ['$scope', 'Users', function($scope, Users) {

}]);
