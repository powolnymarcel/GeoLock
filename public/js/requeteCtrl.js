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
		//Indiquer dans les input les coordonnées
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

	// Récupérer les coordonées précise de l'utilisateur, basée sur la permission de geolocation
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

	//Recuperer les paramètres de recherche et les incorporer dans un obj JSON
	$scope.requeteRestos = function(){
		if(!$scope.formData.latit){
			$scope.formData.latit = $scope.formData.latitude;
			console.log('****LATITUDE:***********');
			console.log($scope.formData.latit);
		}

		if(!$scope.formData.longit){
			$scope.formData.longit = $scope.formData.longitude;
			console.log('****LONGITUDE:***********');
			console.log($scope.formData.longit);
		}
		if(!$scope.formData.distance){
			$scope.formData.distance =6;
		}

		console.log('****distance:***********');
		console.log($scope.formData.distance);
		console.log('****distance:***********');



		// Assemblage de l'obj
		lesRequetes = {
			longitude: parseFloat($scope.formData.longit),
			latitude: parseFloat($scope.formData.latit),
			distance: parseFloat($scope.formData.distance),
			pizza: $scope.formData.pizza,
			frites: $scope.formData.frites,
			pita:$scope.formData.pita,
			name: $scope.formData.name,
			enBelgique: $scope.formData.enBelgique
		};
		console.log(lesRequetes);

		// Poster la variable "lesRequetes" vers la routes POST /requete pour enclecher la recherche filtrée
		$http.post('/requete', lesRequetes)

			// Stocker la recherche filtrée dans "lesRequetesResultats"
			.success(function(lesRequetesResultats){

				//Log de "lesRequetesResultats" & "lesRequetes"
				//console.log("lesRequetes:");
				//console.log(lesRequetes);
				//console.log("lesRequetesResultats:");
				//console.log(lesRequetesResultats);

				gservice.refresh(lesRequetes.latitude, lesRequetes.longitude, lesRequetesResultats);

				//Compte le nombre de resultats
				$scope.queryCount = lesRequetesResultats.length;
			})
			.error(function(lesRequetesResultats){
				console.log('Error ' + lesRequetesResultats);
			})
	};
});
