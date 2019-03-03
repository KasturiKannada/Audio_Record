tlgApp.controller('mainController',['$scope','internationalizationService','Constant.labels','$rootScope','$http','$timeout','localStorageService','dataService','$window','apiUrl','$routeParams','$cookies', function($scope,internationalizationService,Constantlabels,$rootScope,$http,$timeout,localStorageService,dataService,$window,apiUrl,$routeParams,$cookies) {
  // var result = internationalizationService.checkAndSetStorage('English');
  // result.then(function(resolve) {
  //   $scope.labels = {};
  //   $scope.sidebarlist = internationalizationService.get(Constantlabels.side_bar);
  // }, function(reject) {
  //   alert("Failed to render the labels! Please refresh the page . If problem persists, contact support.");
  // });
  $rootScope.authenticationFailure=function(){
    alertify.error("Authentication Failure");       
    $window.location.href ='#/login'
  }
  $rootScope.logout = function () {
    localStorageService.clearAll();
     $cookies.remove('TLG');
  }
   $rootScope.onlylocalstoragelogout = function () {
    localStorageService.clearAll();
  }
     $rootScope.logoutonclick = function () {
     localStorageService.clearAll();
     $cookies.remove('TLG');
      $window.location.href ='#/login'
  }
  // $rootScope.loadLabels=function(){
  //   localStorageService.clearAll();
  //   var result = internationalizationService.checkAndSetStorage('English');
  //   result.then(function(resolve) {
  //     $scope.labels = {};
  //     $scope.sidebarlist = internationalizationService.get(Constantlabels.side_bar);
  //   }, function(reject) {
  //     alert("Failed to render the labels! Please refresh the page . If problem persists, contact support.");
  //   });
  // }
//   $scope.initialize = function() {
//     $rootScope.showAdminMenu=false;
//    if (dataService.isUserLoggedIn()) {
//      $rootScope.user_data=dataService.getUserDetails()
//       if($rootScope.user_data.alignPlusRoles==='Project Consultant (Licensee)'||$rootScope.user_data.alignPlusRoles==='Platform Administrator'){
//        $rootScope.showAdminMenu=true;
//     }
//     if($rootScope.user_data.alignPlusRoles==='Project Consultant (Licensee)'||$rootScope.user_data.alignPlusRoles==='Project Member'){
//      $http({
//       url: apiUrl+"/rest/TLGProject/getProjectList",
//       method: "POST",
//       data: {"userID":$rootScope.user_data.userId,"roleName":$rootScope.user_data.alignPlusRoles},
//       headers: {'Content-Type':'application/json',
//       'Accept':'application/json',
//       "Authorization":dataService.getUserToken()
//     }
//   }).then(function(response) {
//     $rootScope.projectList=response.data;
//     if($rootScope.projectList.length>0){
//     $timeout( function(){ 
//       if($routeParams.projectid){
//         $rootScope.getToolListOverRefresh($routeParams.projectid,$routeParams.toolname)
//       }else{
//        $rootScope.getToolList($rootScope.projectList[0].projectID)
//      }
//    }, 300);
//     }else if ($rootScope.user_data.alignPlusRoles==='Project Consultant (Licensee)'){
//        $window.location.href ='#/projects'
//     }else{
//        $window.location.href ='#/login'
//     }
//   }, 
//   function(error){
//     if(error.status===401){
//      $rootScope.authenticationFailure();
//    }else{
//     alertify.error("Project Failure");
//   }
// });
// }else if ($rootScope.user_data.alignPlusRoles==='Platform Administrator'){
//  // $rootScope.projectList=[];
//  //    $rootScope.showAdminMenu=true;
//  // $window.location.href ='#/createorganisation'
// }else{
//   $window.location.href ='#/login'
// }
// }
// }

$rootScope.getUserList=function(projectid){
    $http({
    url: apiUrl+"/rest/TLGProject/getProjectStatus",
    method: "POST",
    data: {"projectID":projectid},
    headers: {'Content-Type':'application/json','Accept':'application/json',"Authorization":dataService.getUserToken()}
  }).then(function(response) {
    $rootScope.userList=response.data[0].userToolWithStatus;
$rootScope.individualuserList=[];
$scope.user={
  "firstname":null,
  "secondname":null,
  "id":null
}
    angular.forEach($rootScope.userList, function(tool,index){
if($rootScope.firstToolName===tool.toolName){
$scope.user={
  "firstname":tool.firstName,
  "secondname":tool.lastName,
  "id":tool.id
}
$rootScope.individualuserList.push($scope.user);
}
 });
  }, 
  function(error){
    if(error.status===401){
      $rootScope.authenticationFailure();
    }else{
      alertify.error("tool Failure");
    }
  });
}
// $scope.initialize();



$rootScope.showIndexDashboard=function(url,id){
  $window.location.href=url+$rootScope.projectId;
}

$rootScope.addingActiveClasstoSidemenu=function(sidebarlinkId){
  $timeout( function(){  
    var url = window.location.hash;
    var urls=url.split("/");
    var firsturl=urls[1]
    var secondurl=urls[2]
    if(firsturl==='tool'){
      var id=secondurl+'Questionnaire'
    }else if(firsturl==='index'){
      var id=secondurl+'index'
    }else if(firsturl==='brexitInsight'){
     var id=secondurl+'insight' 
   }else if(firsturl==='insight'){
     var id=secondurl+'insight' 
   }else if(firsturl==='user'){
      var id=secondurl+'user' 
   }else if(firsturl==='users'){
    var id=secondurl+urls[8]
   }else if(firsturl==='headline'){
    var id=secondurl+'headline' 
   }else if(firsturl==='headlineuser'){
    var id=secondurl+'headlineuser' 
   }else if(firsturl==='headlinedimension'){
    var id=secondurl+'headlinedimension' 
   }else if(firsturl==='projects'||firsturl==='createproject'||firsturl==='createorganisation'||firsturl==='createuser'||firsturl==='createrole'||firsturl==='creategroup'){
    var id=firsturl;
   }else if(firsturl==='dimension'){
    var id=secondurl+'dimension' 
   }else if(firsturl==='toolteam'){
    var id=secondurl+'toolteam' 
   }
   $('.treeview-menu li').removeClass('active');
   $('.treeview-menu li').removeClass('active');
   $('#'+id).parent().addClass("active"); }, 900);
}
}]);
