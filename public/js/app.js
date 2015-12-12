//Déclare le module initial 'geoloc2', on injecte les dépendances necessaires
var app = angular.module('geoLoc2', ['addCtrl', 'geolocation', 'gservice', 'ngRoute'])


//Configuration du routing au sein d'Angular, utilisation de la vue et du Ctrl nécessaire
.config(function($routeProvider){

	// Join Team Control Panel
	$routeProvider.when('/rejoindre', {
		controller: 'addCtrl',
		templateUrl: 'templates/ajoutForm.html',

		// Find Teammates Control Panel
	}).when('/trouver', {
		templateUrl: 'templates/requeteForm.html',

		// All else forward to the Join Team Control Panel
	}).otherwise({redirectTo:'/rejoindre'})
});
