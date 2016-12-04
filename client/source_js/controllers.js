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
      console.log("fb login: ", response);

      if (response.authResponse) {
        FB.api('/me', function(response) {
          console.log("fb me: ", response);

          Users.getFBUser(response.id).success(function(userdata){
            console.log("getfbuser response: ", userdata);
            console.log("getfbuser length: ", userdata.data.length);
            if (userdata.data.length == 0){
              srvAuth.setUserFacebookId(response.id);
              Users.addUser(response.id).success(function(userdata){
                srvAuth.setUserMongoId(userdata.data._id);
                $location.path( "/create_profile" );
              }); //TODO: Add failure case for adding user, and for if user length > 1
            } else {


              user = userdata.data[0]
              console.log("getfbuser response: ", user.major);
              console.log("getfbuser response: ", user.classes.length);
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

gradu8Controllers.controller('CreateProfileController', ['$scope', '$location', 'Users', 'srvAuth',  'Universities', 'Majors', 'Minors', function($scope, $location, Users, srvAuth, Universities, Majors, Minors) {
  Universities.getAllSchools().success(function(data) {
    $scope.universityOptions = data.data;  });
  Majors.getAllMajors().success(function(data) {
    $scope.majorOptions = data.data;
  });
  Minors.getAllMinors().success(function(data) {
    $scope.minorOptions = data.data;
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

gradu8Controllers.controller('AddClassesController', ['$scope', '$location', '$window', 'Users', 'srvAuth', 'Classes', 'Labels', function($scope, $location, $window, Users, srvAuth, Classes, Labels) {
  $scope.classes = [
    {"_id" : 1, "department" : "CS" , "number" : 125 , "title" : "Intro to Computer Science" },
    {"_id" : 2,"department" : "CE" , "number" : 101 , "title" : "Intro to Computer Engineering" },
    {"_id" : 3, "department" : "CS" , "number" : 225 , "title" : "Data Structures" },
    {"_id" : 4, "department" : "TGMT" , "number" : 460 , "title" : "Shit show"},
    {"_id" : 5, "department" : "TGMT" , "number" : 4601 , "title" : "Shit show"},
    {"_id" : 6, "department" : "TGMT" , "number" : 4602 , "title" : "Shit show"},
    {"_id" : 7, "department" : "TGMT" , "number" : 4602 , "title" : "Shit show"}
  ];
  // $scope.Classes.getPublicClasses().success(function(data) {
  //   $scope.classes = data.data;
  // });

  Labels.getPublicLabels().success(function(data) {
    $scope.labels = data.data;

    for (i = 0; i < $scope.labels.length; i++) {
      $scope.labels[i]["classes"] = [];
      if (i < 4) $scope.labels[i]["expanded"] = true;
      else $scope.labels[i]["expanded"] = false;
    }

    $scope.unassignedLabel = $scope.labels.find(findUnassignedLabel);
    var index = $scope.labels.indexOf($scope.unassignedLabel);
    if (index > -1) {
      $scope.labels.splice(index, 1);
    }

  });

  $scope.classFilter = function(_class) {
      var regex = new RegExp($scope.classSelected, 'i');
      return regex.test(_class.title) || regex.test(_class.department + _class.number) || regex.test(_class.department + " " + _class.number); // test on both field
  };

  $scope.addClass = function($item, $model, $label) {
    var index = $scope.unassignedLabel.classes.indexOf($item);
    if (index < 0) {
      $scope.unassignedLabel.classes.push($item);
    }
    $scope.classSelected = "";
  };

  $scope.removeClass = function(_class, array) {
    var index = array.indexOf(_class);
    if (index > -1) {
      array.splice(index, 1);
    }
  };

  $scope.generateCalendar = function() {
    $scope.labels.push($scope.unassignedLabel);
    var userClasses = [];
    var semester = 0;

    for (i = 0 ; i < $scope.labels.length ; i++) {
      var labelId = $scope.labels[i]._id;
      for (j = 0 ; j < $scope.labels[i].classes.length ; j++) {
        var _class = {
          classId : $scope.labels[i].classes[j]._id,
          labelId : $scope.labels[i]._id,
          semester : 0
        }
        userClasses.push(_class);
      }
    }

    user = srvAuth.getUser();
    Users.addUserClasses(user.userId, userClasses).success(function(data) {
      console.log("Added Classes to user");
      console.log(data);
      $location.path( "/calendar" );
    });

  };

  function findUnassignedLabel(label) {
    return label.name === 'Unassigned Classes';
  }

}]);

gradu8Controllers.controller('CalendarController', ['$scope', 'Users', 'Classes', 'Labels', function($scope, Users, Classes, Labels) {

}]);

gradu8Controllers.controller('EditProfileController', ['$scope', 'Users', function($scope, Users) {

}]);
