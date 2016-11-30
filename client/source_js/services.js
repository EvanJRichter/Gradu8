var gradu8Services = angular.module('gradu8Services', []);

gradu8Services.factory('CommonData', function(){
    var data = "";
    return{
        getData : function(){
            return data;
        },
        setData : function(newData){
            data = newData;
        }
    }
});

gradu8Services.factory('Llamas', function($http, $window) {
    return {
        get : function() {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.get(baseUrl+'/api/llamas');
        }
    }
});

gradu8Services.factory('srvAuth', function($http, $window, $rootScope) {
    var watchLoginChangeLogic = function() {
      console.log("Watchin da change")
      var _self = this;
      FB.Event.subscribe('auth.authResponseChange', function(res) {
        if (res.status === 'connected') {
            console.log("connected")

            /*
            The user is already logged,
            is possible retrieve his personal info
            */
            _self.getUserInfo();
            console.log(res.authResponse);
            /*
            This is also the point where you should create a
            session for the current user.
            For this purpose you can use the data insIde the
            res.authResponse object.
            */
        }
        else {
            console.log("notconnected")

            /*
            The user is not logged to the app, or into Facebook:
            destroy the session on the server.
            */
        }
      });
    };

    var getUserInfoLogic = function() {
      var _self = this;
      FB.api('/me', function(res) {
        $rootScope.$apply(function() {
          $rootScope.user = _self.user = res;
        });
      });
    };

    var logoutLogic = function() {
      var _self = this;
      FB.logout(function(response) {
        $rootScope.$apply(function() {
          $rootScope.user = _self.user = {};
        });
      });
    };

    var testAPILogic = function() {
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/me', function(response) {
          console.log('Successful login for: ' + response.name);
          document.getElementById('status').innerHTML =
            'Thanks for logging in, ' + response.name + '!';
        });
      }

    return {
        watchLoginChange: watchLoginChangeLogic,
        getUserInfo : getUserInfoLogic,
        logout : logoutLogic,
        testAPI: testAPILogic
    };
});

mp4Services.factory('Users', function($http, $window) {
  var baseUrl = "http://localhost:3001"

  var getUserFBHandler = function(fbId) {
    var whereUrl = 'where={"facebookId":"'+ fbId +'"}';
    return $http.get(baseUrl + '/api/users/?' + whereUrl);
  };
  var getUserHandler = function(userId) {
    return $http.get(baseUrl + '/api/users/' + userId);
  };
  var addUserHandler = function(fbId) {
    return $http.post(baseUrl + '/api/users/', {facebookId: facebookId});
  };
  var putUserProfileHandler = function(userObj) {
    return $http.put(baseUrl + '/api/users/' + userObj._id , userObj);
  };
  var getUserClassesHandler = function(fbId) {
    var whereUrl = 'where={"facebookId":"'+ fbId +'"}';
    var selectUrl = 'select={classes:1}';
    return $http.get(baseUrl + '/api/users/?' + whereUrl + '&' + selectUrl);
  };
  var addUserClassesHandler = function(fbId, classes) {
    var whereUrl = 'where={"facebookId":"'+ fbId +'"}';
    return $http.get(baseUrl + '/api/users/?' + whereUrl).success(function(data) {
      var userObj = data.data;
      // TODO check somewhere that classes make sense?
      userObj.classes.push(classes);
      $http.put(baseUrl + '/api/users/' + userObj._id, userObj);
    });
  };
  var deleteUserClassHandler = function(fbId, _class) {
    var whereUrl = 'where={"facebookId":"'+ fbId +'"}';
    return $http.get(baseUrl + '/api/users/?' + whereUrl).success(function(data) {
      var userObj = data.data;
      var index = userObj.classes.indexOf(_class);
      if (index > -1) {
        userObj.classes.splice(index, 1);
      }
      $http.put(baseUrl + '/api/users/' + userObj._id, userObj);
    });
  };

  var getUserLabelsHandler = function(fbId) {
    var whereUrl = 'where={"facebookId":"'+ fbId +'"}';
    var selectUrl = 'select={labels:1}';
    return $http.get(baseUrl + '/api/users/?' + whereUrl + '&' + selectUrl);
  };

  var addUserLabelsHandler = function(fbId, labels) {
    var whereUrl = 'where={"facebookId":"'+ fbId +'"}';
    return $http.get(baseUrl + '/api/users/?' + whereUrl).success(function(data) {
      var userObj = data.data;
      // TODO check somewhere that classes make sense?
      userObj.labels.push(labels);
      $http.put(baseUrl + '/api/users/' + userObj._id, userObj);
    });
  };

  var deleteUserLabelHandler = function(fbId, label) {
    var whereUrl = 'where={"facebookId":"'+ fbId +'"}';
    return $http.get(baseUrl + '/api/users/?' + whereUrl).success(function(data) {
      var userObj = data.data;
      var index = userObj.labels.indexOf(label);
      if (index > -1) {
        userObj.labels.splice(index, 1);
      }
      $http.put(baseUrl + '/api/users/' + userObj._id, userObj);
    });
  };

  return {
    getFBUser: getFBUserHandler,
    getUser: getUserHandler,
    addUser: addUserHandler,
    putUserProfile: putUserProfileHandler,
    getUserClasses: getUserClassesHandler,
    addUserClasses: addUserClassesHandler,
    deleteUserClass: deleteUserClassHandler,
    getUserLabels: getUserLabelsHandler,
    addUserLabels: addUserLabelsHandler,
    deleteUserLabel: deleteUserLabelHandler
  };
});


mp4Services.factory('Classes', function($http, $window) {
  var baseUrl = "http://localhost:3001"
  var getClassHandler = function(classId){
      return $http.get(baseUrl + '/api/classes/' + classId);
  };

  var getPublicClassesHandler = function() {
    var whereUrl = 'where={"public": true}';
    var selectUrl = 'select={number:1,department:1,title:1}';
    return $http.get(baseUrl + '/api/classes/?' + whereUrl + '&' + selectUrl);
  };

  var addClassHandler = function() { return;  };
  var updateClassHandler = function() { return;  };
  var deleteClassHandler = function() { return;  };

  return {
    getClass: getClassHandler, //both
    getPublicClasses: getPublicClassesHandler, //public
    addClass: addClassHandler, //private
    updateClass: updateClassHandler,//private
    deleteClass: deleteClassHandler//private
  };
});



mp4Services.factory('Labels', function($http, $window) {
  var baseUrl = "http://localhost:3001"
  var getLabelHandler = function(labelId){
      return $http.get(baseUrl + '/api/labels/' + labelId);
  };

  var getPublicLabelsHandler = function() {
    var whereUrl = 'where={"public": true}';
    return $http.get(baseUrl + '/api/labels/?' + whereUrl);
  };

  var addLabelHandler = function(name, color) {
    return $http.post(baseUrl + '/api/labels/', {
      name: name,
      color: color,
      public: false
    });
  };
  var updateLabelHandler = function(labelId, name, color) {
    return $http.put(baseUrl + '/api/labels/' + labelId, {
      name: name,
      color: color,
      public: false
    });
  };
  var deleteLabelHandler = function(labelId) {
    return getLabelHandler(labelId).success(function(data) {
      var labelObj = data.data;
      $http.delete(baseUrl + '/api/labels/' + labelObj._id);
    });
  };

  return {
    getLabel: getLabelHandler, //both
    getPublicLabels: getPublicLabelsHandler, //public
    addLabel: addLabelHandler, //private
    updateLabel: updateLabelHandler,//private
    deleteLabel: deleteLabelHandler//private
  };
});
