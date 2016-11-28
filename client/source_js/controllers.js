var gradu8Controllers = angular.module('gradu8Controllers', []);

gradu8Controllers.controller('IntroController', ['$scope', 'CommonData', 'srvAuth'  , function($scope, CommonData, srvAuth) {
  $scope.data = "";
   $scope.displayText = "Hey, its me kids!"

  $scope.setData = function(){
    CommonData.setData($scope.data);
    $scope.displayText = "Data set"
  };
  $scope.logout = function(){
    srvAuth.logout();
    $scope.displayText = "Logged out"
  };

  $scope.fb_login = function() {
    FB.login( function() {}, { scope: 'email,public_profile' } );
  } 


}]);

gradu8Controllers.controller('FirstController', ['$scope', 'CommonData'  , function($scope, CommonData) {
  $scope.data = "";
   $scope.displayText = ""

  $scope.setData = function(){
    CommonData.setData($scope.data);
    $scope.displayText = "Data set"

  };

}]);

gradu8Controllers.controller('SecondController', ['$scope', 'CommonData' , function($scope, CommonData) {
  $scope.data = "";

  $scope.getData = function(){
    $scope.data = CommonData.getData();

  };

}]);


gradu8Controllers.controller('LlamaListController', ['$scope', '$http', 'Llamas', '$window' , function($scope, $http,  Llamas, $window) {

  Llamas.get().success(function(data){
    $scope.llamas = data;
  });


}]);

gradu8Controllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    $scope.displayText = "URL set";

  };

}]);
