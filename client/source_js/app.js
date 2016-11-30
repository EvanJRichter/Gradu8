var app = angular.module('mp4', ['ngRoute', 'gradu8Controllers', 'gradu8Services']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/', {
    templateUrl: 'partials/landing.html',
    controller: 'LandingController'
  }).
  when('/create_profile', {
    templateUrl: 'partials/create_profile.html',
    controller: 'CreateProfileController',
    data: { authorization: true}
  }).
  when('/add_classes', {
    templateUrl: 'partials/add_classes.html',
    controller: 'AddClassesController',
    data: { authorization: true}
  }).
  when('/calendar', {
    templateUrl: 'partials/calendar.html',
    controller: 'CalendarController',
    data: { authorization: true}
  }).
  when('/edit_profile', {
    templateUrl: 'partials/edit_profile.html',
    controller: 'EditProfileController',
    data: { authorization: true}
  }).
  otherwise({
    redirectTo: '/'
  });
}]);

app.run(['$rootScope', '$window', 'srvAuth', '$location', function($rootScope, $window, srvAuth,  $location) {

  $rootScope.user = {};

  $window.fbAsyncInit = function() {
    // Executed when the SDK is loaded
    FB.init({
      /* The app id of the web app */
      appId: '1103104696464387',

      /*
       Adding a Channel File improves the performance
       of the javascript SDK, by addressing issues
       with cross-domain communication in certain browsers.
      */
      channelUrl: '../channel.html',

      /* Set if you want to check the authentication status at the start up of the app */
      status: true,

      /* Enable cookies to allow the server to access the session     */
      cookie: true,

      /* Parse XFBML */
      xfbml: true,

      /* FB SDK Version */
      version: 'v2.8'
    });
    srvAuth.watchLoginChange();
  };

  //srvAuth.testAPILogic();

  (function(d){
    // load the Facebook javascript SDK
    var js,
    id = 'facebook-jssdk',
    ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement('script');
    js.id = id;
    js.async = true;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    ref.parentNode.insertBefore(js, ref);
  }(document));

  $rootScope.$on("$routeChangeStart", function(event, next, current) {
    if ($rootScope.user.id == undefined) {
      // no logged user, we should be going to #login
      if ( next.templateUrl != "partials/intro.html" ) {
        $location.path( "/" );
      }
    }
    //else if($location.url();){}
  });
}]);

app.directive("fb:login-button", function($rootScope) {
    return function (scope, iElement, iAttrs) {
        if (FB) {
            FB.XFBML.parse(iElement[0]);
        }
    };
});
