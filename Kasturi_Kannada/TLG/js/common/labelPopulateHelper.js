/*
 *populate all the labels used in html pages
 *create the local storage of the labels in labesl.json
 */
tlgApp.constant('Constant.labels', {
	side_bar : 'side_bar',
	sst:'sst'
})
tlgApp.service('internationalizationService', ['$http', 'localStorageService', 'Constant.labels', 'dataService', '$q',
function($http, localStorageService, Constantlabels, dataService, $q) {
	var internationalizationService = {};

	internationalizationService.checkAndSetStorage = function(language) {
		var deferred = $q.defer();
		var promise = dataService.getLabels(language);
		promise.then(function(data) {
			//console.log(data.courtdetails);
			localStorageService.set(Constantlabels.side_bar, data.data.side_bar);
			localStorageService.set(Constantlabels.sst, data.data.sst);
			deferred.resolve('Populated successfully');
		});
		//return the promise
		return deferred.promise;
	};
	internationalizationService.get = function(key) {
		return localStorageService.get(key);
	};
	internationalizationService.storeUserInfo = function(user) {
		//localStorageService.setStorageType('sessionStorage');
		localStorageService.set('loggedInUser', user);
	};
	return internationalizationService;
}]);
