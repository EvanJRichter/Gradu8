var gradu8Controllers = angular.module('gradu8Controllers', []);

gradu8Controllers.controller('HeaderController', ['$scope', '$location', function($scope, $location) {
    $scope.$on('$locationChangeSuccess', function(/* EDIT: remove params for jshint */) {
        var path = $location.path();
        //EDIT: cope with other path
        if (path === '/') {
          $scope.templateUrl = "partials/landing_navbar.html";
        }
        else {
          $scope.templateUrl = "partials/login_navbar.html";
        }
    });
}]);

gradu8Controllers.controller('LandingController', ['$scope', 'srvAuth', '$location', 'Users', function($scope, srvAuth, $location, Users) {
  $scope.fb_login = function() {
    FB.login(function(response) {
      if (response.authResponse) {
        FB.api('/me', function(response) {
          Users.getFBUser(response.id).success(function(userdata){
            console.log("USERDATA:", userdata.data);
            console.log("USERDATA:", userdata.data.length);
            if (userdata.data.length == 0){
              console.log(response);
              Users.addUser(response.id).success(function(){
                $location.path( "/create_profile" );
              }); //TODO: Add failure case for adding user, and for if user length > 1
            } else {
              user = userdata.data[0]
              if (user.major === "Unassigned"){
                $location.path( "/create_profile" );
              }
              else if (user.classes.length == 0){
                $location.path( "/add_classes" );
              }
              else {
                $location.path( "/calendar" );
              }
            }
          });
        //  .error(function(response){ //Add failure case for get fb user failing
        //   if(response.message === "User Not Found"){
        //     Users.addUser(response.id).success(function(){
        //       $location.path( "/create_profile" );
        //     });
        //   }
        // });
       });
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
  $scope.universityOptions = [
    { 'id' : 'uiuc', 'label' : 'University of Illinois at Urbana Champaign' }
  ];
  $scope.majorOptions = [
    { 'id' : 'ud', 'label' : 'Undeclared' },
    { 'id' : 'cs', 'label' : 'Computer Science' },
    { 'id' : 'ce', 'label' : 'Computer Engineering' },
    { 'id' : 'ee', 'label' : 'Electrical Engineering' }
  ];
  $scope.minorOptions = [
    { 'id' : 'ad', 'label' : 'Art & Design' },
    { 'id' : 'ba', 'label' : 'Business Administration' },
  ];
  $scope.totalSemesters = 8;
  $scope.currSemester = 1;

  $scope.user = {
    university: undefined,
    major: undefined,
    minor: undefined,
    totalSemesters: 8,
    currSemester: 1,
    classes: []
  };

  $scope.createProfile = function(){
    // Users.putUserProfile($scope.user).success(function(data) {
    //   $window.location.href = '#/add_classes';
    // });
    // TODO get the real user with the ID from the POST user
    console.log("Creating user profile");
    console.log($scope.user);
  };

}]);

gradu8Controllers.controller('AddClassesController', ['$scope', 'Users', 'Classes', 'Labels', function($scope, Users, Classes, Labels) {

}]);

gradu8Controllers.controller('CalendarController', ['$scope', 'Users', 'Classes', 'Labels', function($scope, Users, Classes, Labels) {

}]);

gradu8Controllers.controller('EditProfileController', ['$scope', 'Users', function($scope, Users) {

}]);
