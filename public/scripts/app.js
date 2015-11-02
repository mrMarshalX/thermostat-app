angular.module('thermostat-app', ['ngRoute', 'gmd.dial'])
.config(function ($routeProvider, $locationProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'views/indexView.html',
		controller: 'IndexCtrl'
	});

	$locationProvider.html5Mode(true);
});