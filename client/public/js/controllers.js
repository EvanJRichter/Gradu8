var gradu8Controllers=angular.module("gradu8Controllers",[]);gradu8Controllers.controller("HeaderController",["$scope","$location",function($scope,$location){$scope.$on("$locationChangeSuccess",function(){var path=$location.path();"/"===path?$scope.templateUrl="partials/landing_navbar.html":$scope.templateUrl="partials/login_navbar.html"})}]),gradu8Controllers.controller("LandingController",["$scope","srvAuth","$location","Users",function($scope,srvAuth,$location,Users){$scope.fb_login=function(){FB.login(function(response){response.authResponse?FB.api("/me",function(response){Users.getFBUser(response.id).success(function(userdata){0==userdata.data.length?(srvAuth.setUserFacebookId(response.id),Users.addUser(response.id).success(function(userdata2){console.log("created user succesfully",userdata2),srvAuth.setUserMongoId(userdata2.data._id),$location.path("/create_profile")})):(user=userdata.data[0],console.log("getfbuser response: ",user.major),console.log("getfbuser response: ",user.classes.length),srvAuth.setUserFacebookId(response.id),srvAuth.setUserMongoId(user._id),"Unassigned"!==user.major&&user.major?0==user.classes.length?$location.path("/add_classes"):$location.path("/calendar"):$location.path("/create_profile"))})}):console.log("User cancelled login or did not fully authorize.")},{scope:"email,public_profile"})},$scope.logout=function(){srvAuth.logout(),$scope.displayText="Logged out",$location.path("/")}}]),gradu8Controllers.controller("CreateProfileController",["$scope","$location","Users","srvAuth","Universities","Majors","Minors",function($scope,$location,Users,srvAuth,Universities,Majors,Minors){Universities.getAllSchools().success(function(data){$scope.universityOptions=data.data}),Majors.getAllMajors().success(function(data){$scope.majorOptions=data.data}),Minors.getAllMinors().success(function(data){$scope.minorOptions=data.data}),$scope.totalSemesters=8,$scope.currSemester=1,$scope.user={university:void 0,major:void 0,minor:void 0,totalSemesters:8,currSemester:1,classes:[],facebookId:0,_id:0},$scope.createProfile=function(){user=srvAuth.getUser(),console.log("user srv",user),$scope.user.facebookId=user.facebookId,$scope.user._id=user.mongoId,Users.putUser($scope.user).success(function(data){console.log("Created user profile",data.data),$location.path("/add_classes")})}}]),gradu8Controllers.controller("AddClassesController",["$scope","$location","$window","Users","srvAuth","Classes","Labels",function($scope,$location,$window,Users,srvAuth,Classes,Labels){function createClassesArray(labels){var userClasses=[];for(i=0;i<labels.length;i++){labels[i]._id;for(j=0;j<labels[i].classes.length;j++){var _class={classId:labels[i].classes[j]._id,labelId:labels[i]._id,semester:0};userClasses.push(_class)}}return console.log("this is the array created",userClasses[0]),userClasses[0]}function findUnassignedLabel(label){return"Unassigned Classes"===label.name}$scope.viewClassSearch=!1,Classes.getDepartments().success(function(data){$scope.departments=data.data}),$scope.onSelectDepartment=function($item,$model,$label){Classes.getDepartmentClasses($item).success(function(data){$scope.viewClassSearch=!0,$scope.departmentClasses=data.data,console.log("classes for department",data.data)})},$scope.onSelectClasses=function($item,$model,$label){var index=$scope.unassignedLabel.classes.indexOf($item);if(index>-1)return void($scope.classSelected="");for(i=0;i<$scope.labels.length;i++)if(index=$scope.labels[i].classes.indexOf($item),index>-1)return void($scope.classSelected="");$scope.unassignedLabel.classes.push($item),$scope.classSelected="",console.log($scope.labels)},Labels.getPublicLabels().success(function(data){for($scope.labels=data.data,i=0;i<$scope.labels.length;i++)$scope.labels[i].classes=[],i<4?$scope.labels[i].expanded=!0:$scope.labels[i].expanded=!1;$scope.unassignedLabel=$scope.labels.find(findUnassignedLabel);var index=$scope.labels.indexOf($scope.unassignedLabel);index>-1&&$scope.labels.splice(index,1);var userId=srvAuth.getUserMongoId();Users.getUser(userId).success(function(data){if(classes=data.data.classes[0],classes&&classes.length>0)for(c=0;c<classes.length;c++)addToLabels(classes[c])})});var addToLabels=function(class_item){Classes.getClass(class_item.classId).success(function(response){for(l=0;l<$scope.labels.length;l++)$scope.labels[l]._id===class_item.labelId&&(console.log("adding",response.data,"to ",$scope.labels[c].classes),$scope.labels[c].classes.push(response.data))})};$scope.removeClass=function(_class,array){var index=array.indexOf(_class);index>-1&&array.splice(index,1)},$scope.generateCalendar=function(){var finalLabels=$scope.labels;finalLabels.push($scope.unassignedLabel);var userClasses=createClassesArray(finalLabels),userId=srvAuth.getUserMongoId();console.log(userClasses),Users.addUserClasses(userId,userClasses).success(function(data){console.log("Added Classes to user",data),$location.path("/calendar")})}}]),gradu8Controllers.controller("CalendarController",["$scope","$q","srvAuth","Users","Classes","Labels",function($scope,$q,srvAuth,Users,Classes,Labels){$scope.viewClassSearch=!1,$scope.saved=!1,Classes.getDepartments().success(function(data){$scope.departments=data.data}),$scope.onSelectDepartment=function($item,$model,$label){Classes.getDepartmentClasses($item).success(function(data){$scope.viewClassSearch=!0,$scope.departmentClasses=data.data,console.log("classes for department",data.data)})},$scope.onSelectClasses=function($item,$model,$label){if($scope.semesters&&$scope.semesters[0]&&$scope.semesters[0].classes){var index=$scope.semesters[0].classes.indexOf($item);if(index>-1)return void($scope.classSelected="");for(i=0;i<$scope.semesters.length;i++)if(index=$scope.semesters[i].classes.indexOf($item),index>-1)return void($scope.classSelected="");var elem={};elem.classId=$item._id,elem.labelId="58433382e7f552075318219f",$scope.semesters[0].classes.push(elem),$scope.classSelected="",console.log($scope.semesters)}},$scope.classesData=[],$scope.labelsData=[],$scope.loading=!0,$scope.activeClass={},setTimeout(function(){$q.all([Labels.getPublicLabels(),Users.getUser(srvAuth.getUserMongoId())]).then(function(data){$scope.labelsData=data[0].data.data,$scope.labels=data[0].data.data,$scope.user=data[1].data.data,console.log($scope.user),$scope.classesFromUser=$scope.user.classes,$scope.numSemesters=$scope.user.totalSemesters,console.log("User classes",$scope.user.classes),$scope.semesters=createSemesters($scope.user.classes,$scope.user.currSemester),updateClasses(),updateLabels(),$scope.loading=!1})},1e3),$scope.getLabelById=function(labelId){var ret=null;return $scope.labelsData.forEach(function(label){label._id===labelId&&(ret=label)}),ret},$scope.getClassById=function(classId){var ret=null;return $scope.classesData.forEach(function(_class){_class._id===classId&&(ret=_class)}),ret};var createSemesters=function(classes,currSemester){for(var semesters=[],semesters_len=$scope.numSemesters+1,i=0;semesters_len>i;i++){var semester={};1==i?semester.title="1st semester":2==i?semester.title="2nd semester":3==i?semester.title="3rd semester":semester.title=i+"th semester",semester.classes=[],semester.current=!1,i==currSemester&&(semester.current=!0),semesters.push(semester)}for(var i=0;i<classes.length;i++){var curr_semester=classes[i].semester,_class={};_class.classId=classes[i].classId,_class.labelId=classes[i].labelId,semesters[curr_semester].classes.push(_class)}return semesters},updateClasses=function(){$scope.classesData=[];for(var i=0;i<$scope.classesFromUser.length;i++)Classes.getClass($scope.classesFromUser[i].classId).success(function(response){$scope.classesData.push(response.data)})},updateLabels=function(){$scope.labelsData=[];for(var i=0;i<$scope.classesFromUser.length;i++)Labels.getLabel($scope.classesFromUser[i].labelId).success(function(response){$scope.labelsData.push(response.data)})};$scope.updateUserCalendar=function(){classes=[],console.log("updating user calendar",$scope.semesters);for(var s=0;s<$scope.semesters.length;s++)for(var i=0;i<$scope.semesters[s].classes.length;i++)class_item={classId:$scope.semesters[s].classes[i].classId,labelId:$scope.semesters[s].classes[i].labelId,semester:s},classes.push(class_item);console.log(classes),$scope.user.classes=classes,Users.putUser($scope.user).success(function(data){console.log("Updated user classes",data),$scope.saved=!0})},$scope.updateActiveClass=function(class_item){$scope.activeClass=$scope.getClassById(class_item.classId)},$scope.removeClass=function(_class,array){var index=array.indexOf(_class);index>-1&&array.splice(index,1)}}]),gradu8Controllers.controller("EditProfileController",["$scope","$location","$q","Users","srvAuth","Universities","Majors","Minors",function($scope,$location,$q,Users,srvAuth,Universities,Majors,Minors){function matchIdObjects(universities,majors,minors,user){return user.university=searchById(universities,user.university),user.major=searchById(majors,user.major),user.minor=searchById(minors,user.minor),user}function searchById(array,value){for(var i=0;i<array.length;i++)if(array[i]._id===value)return array[i]}$scope.loading=!0,$q.all([Universities.getAllSchools(),Majors.getAllMajors(),Minors.getAllMinors(),Users.getUser(srvAuth.getUserMongoId())]).then(function(data){$scope.universityOptions=data[0].data.data,$scope.majorOptions=data[1].data.data,$scope.minorOptions=data[2].data.data,$scope.user=data[3].data.data,$scope.user=matchIdObjects($scope.universityOptions,$scope.majorOptions,$scope.minorOptions,$scope.user),$scope.loading=!1}),$scope.editProfile=function(){$scope.user.university&&($scope.user.university=$scope.user.university._id),$scope.user.major&&($scope.user.major=$scope.user.major._id),$scope.user.minor&&($scope.user.minor=$scope.user.minor._id),console.log("posting editted user",$scope.user),Users.putUser($scope.user).success(function(data){console.log("Updated user profile",data),$location.path("/calendar")})}}]);