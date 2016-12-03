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
            if (userdata.data.length == 0){
              srvAuth.setUserFacebookId(response.id);
              Users.addUser(response.id).success(function(userdata){
                srvAuth.setUserMongoId(userdata.data._id);
                $location.path( "/create_profile" );
              }); //TODO: Add failure case for adding user, and for if user length > 1
            } else {
              user = userdata.data[0]
              if (user.major === "Unassigned"){
                srvAuth.setUserFacebookId(response.id);
                srvAuth.setUserMongoId(user._id);
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
    $location.path( "/");
  };

}]);

gradu8Controllers.controller('CreateProfileController', ['$scope', '$location', 'Users', 'srvAuth', 'Universities', 'Majors', 'Minors', function($scope, $location, Users, srvAuth, Universities, Majors, Minors) {
  // $scope.universityOptions = [
  //   { 'id' : 'uiuc', 'label' : 'University of Illinois at Urbana Champaign' }
  // ];
  Universities.getAllSchools().success(function(data) {
    $scope.universityOptions = data.data;
    console.log('universities: ', data.data); // "UIUC"
  });
  // $scope.majorOptions = [
  //   { 'id' : 'ud', 'label' : 'Undeclared' },
  //   { 'id' : 'cs', 'label' : 'Computer Science' },
  //   { 'id' : 'ce', 'label' : 'Computer Engineering' },
  //   { 'id' : 'ee', 'label' : 'Electrical Engineering' }
  // ];
  Majors.getAllMajors().success(function(data) {
    $scope.majorOptions = data.data;
    // console.log('majors: ', data.data);
  });
  // $scope.minorOptions = [
  //   { 'id' : 'ad', 'label' : 'Art & Design' },
  //   { 'id' : 'ba', 'label' : 'Business Administration' },
  // ];
  Minors.getAllMinors().success(function(data) {
    $scope.minorOptions = data.data;
    // console.log('minors: ', data.data);
  });
  $scope.totalSemesters = 8;
  $scope.currSemester = 1;

  $scope.user = {
    university: undefined,
    major: undefined,
    minor: undefined,
    totalSemesters: 8,
    currSemester: 1,
    classes: [],
    facebookId: 0,
    _id: 0
  };

  $scope.createProfile = function(){
    user = srvAuth.getUser();
    $scope.user.facebookId = user.facebookId;
    $scope.user._id = user.mongoId;
    Users.putUserProfile($scope.user).success(function(data) {
      console.log("Created user profile");
      console.log(data);
      $location.path( "/add_classes" );
    });
  };
}]);

gradu8Controllers.controller('AddClassesController', ['$scope', 'Users', 'Classes', 'Labels', function($scope, Users, Classes, Labels) {
  // $scope.classes = [
  //   {"id" : 1, "department" : "CS" , "number" : 125 , "title" : "Intro to Computer Science" },
  //   {"id" : 2,"department" : "CE" , "number" : 101 , "title" : "Intro to Computer Engineering" },
  //   {"id" : 3, "department" : "CS" , "number" : 225 , "title" : "Data Structures" },
  //   {"id" : 4, "department" : "TGMT" , "number" : 460 , "title" : "Shit show"}
  // ];
  Classes.getPublicClasses().success(function(data) {
    $scope.classes = data.data;
    console.log(data.data);
  });
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
