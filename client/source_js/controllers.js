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
              Users.addUser(response.id).success(function(userdata2){
                console.log("created user succesfully", userdata2)
                srvAuth.setUserMongoId(userdata2.data._id);
                $location.path( "/create_profile" );
              }); //TODO: Add failure case for adding user, and for if user length > 1
            } else {
              user = userdata.data[0]
              console.log("getfbuser response: ", user.major);
              console.log("getfbuser response: ", user.classes.length);

              //for redundancy
              srvAuth.setUserFacebookId(response.id);
              srvAuth.setUserMongoId(user._id);
              if (user.major === "Unassigned" || !user.major) {
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
    console.log("user srv", user);
    $scope.user.facebookId = user.facebookId;
    $scope.user._id = user.mongoId;
    Users.putUser($scope.user).success(function(data) {
      console.log("Created user profile", data.data);
      $location.path( "/add_classes" );
    });
  };
}]);

gradu8Controllers.controller('AddClassesController', ['$scope', '$location', '$window', 'Users', 'srvAuth', 'Classes', 'Labels', function($scope, $location, $window, Users, srvAuth, Classes, Labels) {
  $scope.viewClassSearch = false;

  Classes.getDepartments().success(function(data) {
    $scope.departments = data.data;
  });

  $scope.onSelectDepartment = function($item, $model, $label) {
    var department = $item;
    Classes.getDepartmentClasses(department).success(function(data) {
      $scope.viewClassSearch = true;
      $scope.departmentClasses = data.data;
    });
  };

  $scope.onSelectClasses = function($item, $model, $label) {
    var department = $item;
    Classes.getDepartmentClasses(department).success(function(data) {
      $scope.viewClassSearch = true;
      $scope.departmentClasses = data.data;
    });
  };

  Users.getUser(srvAuth.getUserMongoId()).success(function(response){
    var user = response.data;
  });

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
    var finalLabels = $scope.labels;
    finalLabels.push($scope.unassignedLabel);
    var userClasses = createClassesArray(finalLabels);
    // var user = addUserClasses(user, userClasses);
    var userId = srvAuth.getUserMongoId();
    Users.addUserClasses(userId, userClasses).success(function(data) {
      console.log("Added Classes to user", data);
      $location.path( "/calendar" );
    });

  };

  function createClassesArray(labels) {
    var userClasses = [];
    for (i = 0 ; i < labels.length ; i++) {
      var labelId = labels[i]._id;
      for (j = 0 ; j < labels[i].classes.length ; j++) {
        var _class = {
          classId : labels[i].classes[j]._id,
          labelId : labels[i]._id,
          semester : 0
        };
        userClasses.push(_class);
      }
    }
    return userClasses;
  }

  function addUserClasses(user, classes) {
    if (user.classes)
      user.classes.concat(userClasses);
    else
      user.classes = userClasses;
    return user;
  }

  function findUnassignedLabel(label) {
    return label.name === 'Unassigned Classes';
  }

}]);

gradu8Controllers.controller('CalendarController', ['$scope', 'srvAuth', 'Users', 'Classes', 'Labels', function($scope, srvAuth, Users, Classes, Labels) {

  //dummy data
  $scope.classesData = [
    {"_id" : 1, "department" : "CS" , "number" : 125 , "title" : "Intro to Computer Science" },
    {"_id" : 2, "department" : "CE" , "number" : 101 , "title" : "Intro to Computer Engineering" },
    {"_id" : 3, "department" : "CS" , "number" : 225 , "title" : "Data Structures" },
    {"_id" : 4, "department" : "TGMT" , "number" : 460 , "title" : "Shit show"}
  ];

  $scope.labelsData = [
    {"_id" : 1, "name" : "Major" , "color" : "#f00" },
    {"_id" : 2, "name" : "Minor" , "color" : "#0f0" },
    {"_id" : 3, "name" : "Elective" , "color" : "#00f" }
  ];

  $scope.classesFromUser = [[1, 1, 0], [1, 2, 0], [2, 1, 0], [1, 1, 0], [1, 1, 0], [2, 2, 1], [2, 2, 2], [2, 2, 3], [3, 3, 2], [3, 3, 3],[2, 1, 7], [2, 2, 8]];
  $scope.numsemesters = 8;
  $scope.currentSemester = 1;
  $scope.semesters = [];

  //----- Real Data ----- //
  //get users to get classes, current semester, total semesters
  Users.getUser(srvAuth.getUserMongoId()).success(function(response){
    $scope.classesFromUser = response.data.classes;
    $scope.numsemesters =  response.data.totalSemesters;
    $scope.currentSemester =  response.data.currSemester;
    updateSemesters();
    //get classes to match class ids
    updateClasses();
    //get labels to match label ids
    updateLabels();
  });

  $scope.getLabelById = function(labelId){
    var ret = null;
    $scope.labelsData.forEach(function(label) {
      if (label._id === labelId){
        ret = label;
      }
    });
    return ret;
  };
  $scope.getClassById = function(classId){
    var ret = null;
    $scope.classesData.forEach(function(_class) {
      if (_class._id === classId){
        ret = _class;
      }
    });
    return ret;
  };

  var updateSemesters = function(){
    $scope.semesters = [];
    for (var i = 0; i <= $scope.numsemesters; i++) {
      var sem = {};
      sem.classes = [];
      for (var c = 0; c < $scope.classesFromUser.length; c++){
        if ($scope.classesFromUser[c][2] == i){
          sem.classes.push($scope.classesFromUser[c]);
        }
      }
      $scope.semesters.push(sem); ///working on getting classes into calendar view
    }
  };

  var updateClasses = function(){
    $scope.classesData = [];
    console.log($scope.classesFromUser);
    for (var i = 0; i <= $scope.classesFromUser.length; i++) {
      Classes.getClass($scope.classesFromUser[i].classId).success(function(response){
         $scope.classesData.push(response.data);
      });
    }
  };

  var updateLabels = function(){
    $scope.labelsData = [];
    for (var i = 0; i <= $scope.classesFromUser.length; i++) {
      Labels.getLabel($scope.classesFromUser[i].labelId).success(function(response){
         $scope.labelsData.push(response.data);
      });
    }
  };

}]);

gradu8Controllers.controller('EditProfileController', ['$scope', '$location', '$q', 'Users', 'srvAuth',  'Universities', 'Majors', 'Minors', function($scope, $location, $q, Users, srvAuth, Universities, Majors, Minors) {
  $scope.loading = true;
  $q.all([
    Universities.getAllSchools(),
    Majors.getAllMajors(),
    Minors.getAllMinors(),
    Users.getUser(srvAuth.getUserMongoId())
  ]).then(function(data) {
    $scope.universityOptions = data[0].data.data;
    $scope.majorOptions = data[1].data.data;
    $scope.minorOptions = data[2].data.data;
    $scope.user = data[3].data.data;
    $scope.user = matchIdObjects($scope.universityOptions, $scope.majorOptions, $scope.minorOptions, $scope.user);
    $scope.loading = false;
  });

  function matchIdObjects(universities, majors, minors, user) {
    user.university = searchById(universities, user.university);
    user.major = searchById(majors, user.major);
    user.minor = searchById(minors, user.minor);
    return user;
  }

  function searchById(array, value) {
    for (var i=0; i < array.length; i++) {
      if (array[i]._id === value)
        return array[i];
    }
  }

  $scope.editProfile = function(){
    if ($scope.user.university) $scope.user.university = $scope.user.university._id;
    if ($scope.user.major) $scope.user.major = $scope.user.major._id;
    if ($scope.user.minor) $scope.user.minor = $scope.user.minor._id;
    console.log("posting editted user", $scope.user);
    Users.putUser($scope.user).success(function(data) {
      console.log("Updated user profile", data);
      $location.path( "/calendar" );
    });
  };
}]);
