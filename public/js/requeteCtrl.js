// requeteCtrl.js
// Créee un module et un contolleur 'requeteCtrl'. Ce module dépend(à besoin) des modules et controlleur - 'geolocation' & 'gservice'
var requeteCtrl = angular.module('requeteCtrl', ['geolocation', 'gservice']);
requeteCtrl.controller('requeteCtrl', function($scope, $log, $http, $rootScope, geolocation, gservice){


	//AUTOCOMPLETE INPUT AVEC GOOGLE MAP, utilisation de la librairies "places"
	// ----------------------------------------------------------------------------
	var autocomplete;
	// On cible le input dans lequel l'utilisateur indiquera la ville voulue
	var input = document.getElementById('location');
	//Les options permettent d'indiquer à la librairie que l'on veut lister les villes de Belgique
	var options = {
		componentRestrictions: {'country':'be'},
		types: ['(regions)'] // (cities)
	};

	//autocomplete remplira le input avec les villes correspondant à la recherche
	autocomplete = new google.maps.places.Autocomplete(input,options);


	google.maps.event.addListener(autocomplete, 'place_changed', function () {
		place = autocomplete.getPlace();
		console.log(place);
		console.log(place.geometry.location.lat());
		console.log(place.geometry.location.lng());
		$scope.formData.latit=place.geometry.location.lat();
		$scope.formData.longit=place.geometry.location.lng();
		$scope.formData.htmlverified = "Selection manuelle activée.";

		//Appellez le service gservice et lui indiquer la position voulue par l'utilisateur
		gservice.refresh(place.geometry.location.lat(), place.geometry.location.lng());

	});

	// Initialisation des variables
	// ----------------------------------------------------------------------------
	$scope.formData = {};
	var queryBody = {};

	// Fonctions
	// ----------------------------------------------------------------------------

	// Récupérer les coordonées précise de l'utilisateur, basée sur la permission
	geolocation.getLocation().then(function(data){
		coords = {lat:data.coords.latitude, long:data.coords.longitude};

		// Definir la  latitude & longitude avec les données de geoloc de l'utilisateur, basée sur la permission
		$scope.formData.longitude = parseFloat(coords.long).toFixed(3);
		$scope.formData.latitude = parseFloat(coords.lat).toFixed(3);
	});

	//Ou récupérer les coordonées sur au click de la souris sur la carte
	$rootScope.$on("clicked", function(){

		//Lancer les fn du "gservice" avec les coordonnées
		$scope.$apply(function(){
			$scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
			$scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
		});
	});

	// Take query parameters and incorporate into a JSON queryBody
	//Recuperer les paramètres de recherche et les incorporer dans un obj JSON
	$scope.requeteRestos = function(){

		// Assemblage de l'obj
		lesRequetes = {
			longitude: parseFloat($scope.formData.longitude),
			latitude: parseFloat($scope.formData.latitude),
			distance: parseFloat($scope.formData.distance),
			pizza: $scope.formData.pizza,
			frites: $scope.formData.frites,
			name: $scope.formData.name
		};

		// Post the queryBody to the /query POST route to retrieve the filtered results
		$http.post('/requete', lesRequetes)

			// Store the filtered results in queryResults
			.success(function(lesRequetesResultats){

				// Query Body and Result Logging
				console.log("lesRequetes:");
				console.log(lesRequetes);
				console.log("lesRequetesResultats:");
				console.log(lesRequetesResultats);

				// Count the number of records retrieved for the panel-footer
				$scope.queryCount = lesRequetesResultats.length;
			})
			.error(function(lesRequetesResultats){
				console.log('Error ' + lesRequetesResultats);
			})
	};
});
