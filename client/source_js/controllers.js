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
         Users.getFBUser(response.userID).success(function(userdata){
          if (userdata.major === "Unassigned"){
            $location.path( "/create_profile" );
          }
          else if (userdata.classes.length == 0){
            $location.path( "/add_classes" );
          }
          else {
            $location.path( "/calendar" );
          }
         }).error(function(response){
          if(response.message === "User Not Found"){
            Users.addUser(response.userID).success(function(){
              $location.path( "/create_profile" );
            });
          }
        });
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
  $scope.classes = [
    {"id" : 1, "department" : "CS" , "number" : 125 , "title" : "Intro to Computer Science" },
    {"id" : 2,"department" : "CE" , "number" : 101 , "title" : "Intro to Computer Engineering" },
    {"id" : 3, "department" : "CS" , "number" : 225 , "title" : "Data Structures" },
    {"id" : 4, "department" : "TGMT" , "number" : 460 , "title" : "Shit show"}
  ];
  // $scope.Classes.getPublicClasses().success(function(data) {
  //   $scope.classes = data.data;
  // });
  $scope.unassignedClasses = [];

  $scope.classFilter = function(_class) {
      var regex = new RegExp($scope.classSelected, 'i');
      return regex.test(_class.title) || regex.test(_class.department + _class.number) || regex.test(_class.department + " " + _class.number); // test on both field
  };

  $scope.addClass = function($item, $model, $label) {
    var index = $scope.unassignedClasses.indexOf($item);
    if (index < 0) {
      $scope.unassignedClasses.push($item);
    }
    $scope.classSelected = "";
  };

  $scope.removeClass = function(_class) {
    var index = $scope.unassignedClasses.indexOf(_class);
    if (index > -1) {
      $scope.unassignedClasses.splice(index, 1);
    }
  };

}]);

gradu8Controllers.controller('CalendarController', ['$scope', 'Users', 'Classes', 'Labels', function($scope, Users, Classes, Labels) {

}]);

gradu8Controllers.controller('EditProfileController', ['$scope', 'Users', function($scope, Users) {

}]);
