angular.module('geoLoc2')
//Uniquement à des fins de test.....................
	//La directive appelle un Ctrl, le Ctrl a un scope, le scope est envoyé à la vue
	//Si la vue correspond alors on applique la class
	//Permet de mettre une classe active sur le li
.controller('inutileCtrl', function($scope, $location) {

		$scope.estActif = function (viewLocation) {
			return viewLocation === $location.path();
		};
});
