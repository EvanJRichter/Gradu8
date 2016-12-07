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
    Classes.getDepartmentClasses($item).success(function(data) {
      $scope.viewClassSearch = true;
      $scope.departmentClasses = data.data;
      console.log("classes for department", data.data);
    });
  };
  $scope.onSelectClasses = function($item, $model, $label) {
    var index = $scope.unassignedLabel.classes.indexOf($item);
    if (index > -1) {
      $scope.classSelected = "";
      return;
    }
    for (i = 0; i < $scope.labels.length; i++) {
      index = $scope.labels[i].classes.indexOf($item);
      if (index > -1) {
        $scope.classSelected = "";
        return;
      }
    }
    $scope.unassignedLabel.classes.push($item);
    $scope.classSelected = "";
    console.log($scope.labels);
  };

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
    var userId = srvAuth.getUserMongoId();
    Users.getUser(userId).success(function(data){
      classes = data.data.classes[0];
      if (classes && classes.length > 0){
        for (c = 0; c < classes.length; c++){
          addToLabels(classes[c]);
        }
      }
    });
  });

  var addToLabels = function(class_item){
    Classes.getClass(class_item.classId).success(function(response){
      for (l = 0; l < $scope.labels.length; l++){
        if ($scope.labels[l]._id === class_item.labelId){ //class loading problem is to do with putting it in the correct label, probably around here
          console.log("adding", response.data, "to ", $scope.labels[c]["classes"]);
          $scope.labels[c]["classes"].push(response.data);
        }
      }
    });
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
    var userId = srvAuth.getUserMongoId();
    console.log(userClasses)
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
    console.log("this is the array created", userClasses[0]);
    return userClasses[0];
  }

  function findUnassignedLabel(label) {
    return label.name === 'Unassigned Classes';
  }

}]);

gradu8Controllers.controller('CalendarController', ['$scope', '$q', 'srvAuth', 'Users', 'Classes', 'Labels', function($scope, $q, srvAuth, Users, Classes, Labels) {
  $scope.viewClassSearch = false;
  $scope.saved = false;
  Classes.getDepartments().success(function(data) {
    $scope.departments = data.data;
  });

  $scope.onSelectDepartment = function($item, $model, $label) {
    Classes.getDepartmentClasses($item).success(function(data) {
      $scope.viewClassSearch = true;
      $scope.departmentClasses = data.data;
      console.log("classes for department", data.data);
    });
  };
  $scope.onSelectClasses = function($item, $model, $label) {
    if (!$scope.semesters || !$scope.semesters[0] || !$scope.semesters[0].classes) {
      return;
    }

    var index = $scope.semesters[0].classes.indexOf($item);
    if (index > -1) {
      $scope.classSelected = "";
      return;
    }
    for (i = 0; i < $scope.semesters.length; i++) {
      index = $scope.semesters[i].classes.indexOf($item);
      if (index > -1) {
        $scope.classSelected = "";
        return;
      }
    }
    var elem = {};
    elem["classId"] = $item._id;
    elem["labelId"] = "58433382e7f552075318219f";
    $scope.semesters[0].classes.push(elem);
    // $scope.semesters[0].classes.push($item);
    $scope.classSelected = "";
    console.log($scope.semesters);
  };


  $scope.classesData = [];
  $scope.labelsData = [];
  $scope.loading = true;
  $scope.activeClass = {};
  setTimeout(function(){
    $q.all([
      Labels.getPublicLabels(),
      Users.getUser(srvAuth.getUserMongoId())
    ]).then(function(data) {
      $scope.labelsData = data[0].data.data;
      $scope.labels = data[0].data.data;
      $scope.user = data[1].data.data;
      console.log($scope.user);
      $scope.classesFromUser = $scope.user.classes;
      $scope.numSemesters =  $scope.user.totalSemesters;
      // $scope.currentSemester =  $scope.user.currSemester;
      console.log("User classes", $scope.user.classes);
      $scope.semesters = createSemesters($scope.user.classes, $scope.user.currSemester);
      updateClasses();
      updateLabels();
      $scope.loading = false; //todo not actually done loading until classes and labels are received
    });
  }, 1000);

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

  var createSemesters = function(classes, currSemester){
    var semesters = [];
    var semesters_len = $scope.numSemesters + 1;
    for (var i = 0 ; i < semesters_len ; i++) {
      var semester = {};
      if (i == 1)
        semester["title"] = "1st semester";
      else if (i == 2)
        semester["title"] = "2nd semester";
      else if (i == 3)
        semester["title"] = "3rd semester";
      else
        semester["title"] = i + "th semester";
      semester["classes"] = [];
      semester["current"] = false;
      if (i == currSemester)
        semester["current"] = true;

      semesters.push(semester);
    }
    for (var i = 0 ; i < classes.length ; i++) {
      var curr_semester = classes[i].semester;
      var _class = {};
      _class["classId"] = classes[i].classId;
      _class["labelId"] = classes[i].labelId;
      semesters[curr_semester].classes.push(_class);
    }
    return semesters;
  };

  var updateClasses = function(){
    $scope.classesData = [];
    for (var i = 0; i < $scope.classesFromUser.length; i++) {
      Classes.getClass($scope.classesFromUser[i].classId).success(function(response){
          $scope.classesData.push(response.data);
      });
    }
  };

  var updateLabels = function(){
    $scope.labelsData = [];
    for (var i = 0; i < $scope.classesFromUser.length; i++) {
      Labels.getLabel($scope.classesFromUser[i].labelId).success(function(response){
         $scope.labelsData.push(response.data);
      });
    }
  };

  $scope.updateUserCalendar = function(){
    classes = [];
    console.log("updating user calendar", $scope.semesters);

    for (var s = 0 ; s < $scope.semesters.length; s++) {
      for (var i = 0 ; i < $scope.semesters[s].classes.length; i++) {
        class_item = {
          "classId" : $scope.semesters[s].classes[i].classId,
          "labelId" : $scope.semesters[s].classes[i].labelId,
          "semester" : s
        }
        classes.push(class_item);
      }
    }
    console.log(classes);

    $scope.user.classes = classes;
    Users.putUser($scope.user).success(function(data) {
      console.log("Updated user classes", data);
      $scope.saved = true;
    });
  }
  $scope.updateActiveClass = function(class_item){
    $scope.activeClass = $scope.getClassById(class_item.classId);
  };

  $scope.removeClass = function(_class, array) {
    var index = array.indexOf(_class);
    if (index > -1) {
      array.splice(index, 1);
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
