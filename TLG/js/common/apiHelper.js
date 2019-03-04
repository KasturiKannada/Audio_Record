tlgApp.config(['localStorageServiceProvider', function(localStorageServiceProvider) {
		localStorageServiceProvider.setStorageType('localStorage');
		// localStorageServiceProvider.setStorageType('sessionStorage');
	}])
tlgApp.service('dataService', ['$rootScope', '$http', '$window', 'localStorageService',
	function($rootScope, $http, address, localStorageService) {

		var authurl = null;
		this.formauthenticatedUrl = function() {
			var userdetails = this.getUserDetails();
			if (authurl == null) {
				authurl = URLs.apiBaseURL + URLs.authenticatedBaseURL;
				authurl = authurl.replace('<account_id>', userdetails.account_id);
				return authurl;
			} else {
				return authurl;
			}
		};
		this.setUserDetails = function(userdata) {
			localStorageService.set('loggedInUser', JSON.stringify(userdata));
		};
		this.setUserToken = function(token) {
			localStorageService.set('token', token);
		};
		this.getUserToken = function(token) {
			var userToken = localStorageService.get('token');
			if (userToken == null) {
				localStorageService.clearAll();
			}
			return userToken;
		};
		this.setProjectId = function(token) {
			localStorageService.set('projectID', token);
		};
		this.getProjectId = function() {
			var projectID = localStorageService.get('projectID');
			return projectID;
		};
		this.setData = function(key, val) {
			this.getUserDetails();
			localStorageService.set(key, val);
		};
		this.getData = function(key) {
			this.getUserDetails();
			return localStorageService.get(key);
		};
		this.registerUser = function(method, path, data, headers) {
			return $http({
				method : method,
				url : URLs.apiBaseURL + path,
				headers : headers,
				data : data
			});
		};
		this.signinUser = function(method, path, data, headers) {
			return $http({
				method : method,
				url : path,
				headers : headers,
				data : data
			});
		};
		this.getLabels = function(language) {
			var path="pages/mockdata/labels_"+ language +".json"
			return $http.get(path);
		};
		this.setLoggedInUserProfile = function(data) {
			//console.info("request details:", URLs.requestheaders);
			return $http({
				method : URLs.HTTP_PUT,
				url : URLs.usersUrlForDeviseAPI,
				headers : URLs.requestheaders,
				data : data
			});
		};
		this.signoutuser = function(method, path, headers) {
			var logout = $http({
				method : method,
				url : path,
				headers : headers
			});
			logout.success(function() {
				localStorageService.clearAll();
				address.location.href = URLs.loginView;
			});
		};

		this.handleError = function(status, data) {
		
			if (status == URLs.unauthorizedCode && address.location.hash != "#/login") {
				var userdet = this.getUserDetailsFromServer(URLs.HTTP_GET, URLs.requestheaders);
				userdet.success(function(data) {
					//navigate to login page when unauthorized operations performed
					//its a rare case of getting permission reverted by PA when in action
					//or if logged out in another tab or logged in as another user in another tab
					//localStorageService.set('successmsg', 'You have been prevented from an unauthorized access');
					 displayResult.showErrorResults(Constants.authorizationFailureMsg,'success');
					address.location.href = URLs.loginView;
					//address.location.reload();
					//console.info("in handle error auth fail");

				});
				userdet.error(function(data) {
					localStorageService.set('successmsg', 'You have been prevented from an unauthorized access');
					
					localStorageService.clearAll();
					address.location.href = URLs.loginView;
				    address.location.reload();
				    displayResult.showErrorResults(Constants.authorizationFailureMsg,'success');
					//console.info("in handle error auth fail");
					
				});
			} else if(status == URLs.notFoundCode){
				address.location.href = URLs.notFoundPage;
			}else {

				$rootScope.rs_error_status = status;
				//console.log("inside apihelper", data);
				if (data.error) {
					$rootScope.rs_error_data = data;
					//console.info("in error");
				} else if (data.errors) {
					//console.info("in errors");
					$rootScope.rs_error_data = data.errors;
				}
				var modalInstance = $modal.open({
					templateUrl : 'userinterface/pages/modal/errordialog.html',
					controller : 'modalController'
				});

				modalInstance.result.then(function() {
					//console.info("Exiting modal popup");
				}, function() {
				});

			}
		

		};

		this.deleteData = function(key) {
			return localStorageService.remove(key);
		};
		this.getUserDetails = function() {
			var userdetails = localStorageService.get('loggedInUser');
			if (userdetails == null) {
				localStorageService.clearAll();
				address.location.href = URLs.loginView;
				//console.info("in get user details");

			}
			return userdetails;
		};
		this.isUserLoggedIn = function() {
			var userdetails = localStorageService.get('loggedInUser');
			if (userdetails == null) {
				return false;
			}
			return true;
		};
		this.getAttachmentUrl = function(method, id, headers) {
			return $http({
				method : method,
				url : this.formauthenticatedUrl() + URLs.attachmentsUrl + '/' + id + '/' + URLs.getDownloadUrl,
				headers : headers
			});
		};
		this.getAllTasks = function(method, headers) {
			return $http({
				method : method,
				url : this.formauthenticatedUrl() + URLs.users + '/' + (this.getUserDetails()).id + '/' + URLs.getAllTasks,
				headers : headers
			});
		};
		this.validateAccount = function(method, id, headers) {
			return $http({
				method : method,
				url : URLs.apiBaseURL + URLs.accountExistenceCheck + '?' + URLs.accountNameParam + '=' + id,
				headers : headers
			});
		};
		this.sendShortNote = function(requestUrl, data) {
			return $http({
				method : URLs.HTTP_POST,
				url : this.formauthenticatedUrl() + requestUrl,
				data : data,
				headers : URLs.requestheaders
			});
		};
		this.getUserDetailsFromServer = function(method, headers) {
			return $http({
				method : method,
				url : URLs.apiBaseURL + URLs.me,
				headers : headers
			});
		};
		//it fetches data irrespective of accounts/users etc.
		this.getGlobalData = function(requestUrl) {
			return $http({
				method : URLs.HTTP_GET,
				url : URLs.apiBaseURL + requestUrl,
				headers : URLs.requestheaders
			});
		};
		this.createObject = function(requestUrl, data) {
			return $http({
				method : URLs.HTTP_POST,
				url : this.formauthenticatedUrl() + requestUrl,
				data : data,
				headers : URLs.requestheaders
			});
		};
		this.createObjectBaseUrl = function(requestUrl, data) {
		  return $http({
		    method : URLs.HTTP_POST,
		    url : URLs.apiBaseURL+ requestUrl,
		    data : data,
		    headers : URLs.requestheaders
		  });
		};

		this.updateObject = function(requestUrl, data) {
			return $http({
				method : URLs.HTTP_PUT,
				url : this.formauthenticatedUrl() + requestUrl,
				headers : URLs.requestheaders,
				data : data
			});
		};
		
		this.updateObjectBaseUrl = function(requestUrl, data) {
		  return $http({
		    method : URLs.HTTP_PUT,
		    url : URLs.apiBaseURL+requestUrl,
		    headers : URLs.requestheaders,
		    data : data
		  });
		};

		this.getObject = function(requestUrl) {
			return $http({
				method : URLs.HTTP_GET,
				url : this.formauthenticatedUrl() + requestUrl,
				headers : URLs.requestheaders
			});
		};

		this.getListOfObjects = function(requestUrl) {
			return $http({
				method : URLs.HTTP_GET,
				url : this.formauthenticatedUrl() + requestUrl,
				headers : URLs.requestheaders
			});
		};
		this.getObjectsBaseUrl = function(requestUrl){
		  return $http({
        method : URLs.HTTP_GET,
        url : URLs.apiBaseURL + requestUrl,
        headers : URLs.requestheaders
      });
		};
		this.getArrayOfObjects = function(requestUrl, caseId, searchPattern, pageNo, isCaseDependent, isAdvancedSearch, isBaseURLSufficient,draft) {
			var completeUrl=null;
			if(isBaseURLSufficient){
				completeUrl = URLs.apiBaseURL + requestUrl + '?';
			}else{
				completeUrl = this.formauthenticatedUrl() + requestUrl + '?';			
				
			}
			if (caseId) {
				completeUrl = completeUrl + 'case_id=' + caseId + '&';
			}
			if (searchPattern) {
				if(isAdvancedSearch){
					completeUrl = completeUrl + searchPattern;
					
				}else{					
					completeUrl = completeUrl + 'search=' + searchPattern + '&';
				}
			}
			//console.info("isCaseDep", isCaseDependent);
			if (isCaseDependent==='true') {
				//console.info("isCaseDep", isCaseDependent);
				completeUrl = completeUrl + 'is_case_dependent=true&';
			}else if (isCaseDependent !=='false' && isCaseDependent !==undefined && isCaseDependent !==null) {//undefined case is when this param is not used
				//TODO: using isCaseDependent is a temporary solution
				//this needs to be fixed and send proper string instead of boolean from
				//cost, attaqchment, bookmark, timesheet, shortnotes and tasks
				//for Case and Users - isCaseDependent will be like - is_litigative_case=true 
				//is_office_user=true: 
				completeUrl = completeUrl + isCaseDependent;
			}else if(isCaseDependent ==='false'){
				completeUrl = completeUrl + 'is_case_dependent=false&';
			}
			if (draft) {
				completeUrl = completeUrl + 'draft=true&';
			}
			if (pageNo) {
				completeUrl = completeUrl + 'page=' + pageNo + '&';
			}
			if ($rootScope.objPerPage) {
			  completeUrl = completeUrl + 'per_page=' + $rootScope.objPerPage;
			  //console.log("inside objperpage setup");
			}
			//console.info("full url:", completeUrl);
			return $http({
				method : URLs.HTTP_GET,
				url : completeUrl,
				headers : URLs.requestheaders
			});
		};

		this.deleteObject = function(requestUrl) {
			//console.info("request URL:", requestUrl);
			return $http({
				method : URLs.HTTP_DEL,
				url : this.formauthenticatedUrl() + requestUrl,
				headers : URLs.requestheaders
			});
		};
		
		this.deleteAccount = function(requestUrl) {
			//console.info("request URL:", requestUrl);
			return $http({
				method : URLs.HTTP_DEL,
				url : URLs.apiBaseURL + requestUrl,
				headers : URLs.requestheaders
			});
		};
		
		this.updateAccountDetails = function(requestUrl){
			return $http({
				method : URLs.HTTP_POST,
				url : URLs.apiBaseURL + requestUrl,
				headers : URLs.requestheaders
			});
		};

	}]);
