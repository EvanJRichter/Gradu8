var app=angular.module("gradu8",["ngRoute","gradu8Controllers","gradu8Services","ui.bootstrap","ngDragDrop"]);app.config(["$routeProvider",function($routeProvider){$routeProvider.when("/",{templateUrl:"partials/landing.html",controller:"LandingController"}).when("/create_profile",{templateUrl:"partials/create_profile.html",controller:"CreateProfileController",data:{authorization:!0}}).when("/add_classes",{templateUrl:"partials/add_classes.html",controller:"AddClassesController",data:{authorization:!0}}).when("/calendar",{templateUrl:"partials/calendar.html",controller:"CalendarController",data:{authorization:!0}}).when("/edit_profile",{templateUrl:"partials/edit_profile.html",controller:"EditProfileController",data:{authorization:!0}}).otherwise({redirectTo:"/"})}]),app.run(["$rootScope","$window","srvAuth","$location",function($rootScope,$window,srvAuth,$location){$rootScope.user={},$window.fbAsyncInit=function(){FB.init({appId:"1103104696464387",channelUrl:"../channel.html",status:!0,cookie:!0,xfbml:!0,version:"v2.8"}),srvAuth.watchLoginChange()},function(d){var js,id="facebook-jssdk",ref=d.getElementsByTagName("script")[0];d.getElementById(id)||(js=d.createElement("script"),js.id=id,js.async=!0,js.src="//connect.facebook.net/en_US/sdk.js",ref.parentNode.insertBefore(js,ref))}(document),$rootScope.$on("$routeChangeStart",function(event,next,current){void 0==$rootScope.user.id&&"partials/landing.html"!=next.templateUrl&&$location.path("/"),console.log($location.url())})}]),app.directive("fb:login-button",function($rootScope){return function(scope,iElement,iAttrs){FB&&FB.XFBML.parse(iElement[0])}});