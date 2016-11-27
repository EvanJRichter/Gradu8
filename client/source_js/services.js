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
            For this purpose you can use the data inside the
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

