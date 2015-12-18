
var xxxCtrl = angular.module('xxxCtrl', ['geolocation', 'gservice']);



xxxCtrl.controller('xxxCtrl', function($scope, $log, $http, $rootScope, geolocation, gservice,$routeParams){
	$http.get('/restaurant/'+$routeParams.reference).success(function(data){
		console.log(data)
		$scope.restaurant=data;

	});



});
