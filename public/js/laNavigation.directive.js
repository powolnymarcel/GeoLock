'use strict';

angular.module('geoLoc2')
	.directive('navigation', function () {
		return {
			templateUrl: 'templates/navigation.html',
			restrict: 'E',
			controller:'inutileCtrl'
		};
	});

