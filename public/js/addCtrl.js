// Créee un module et un contolleur 'addCtrl'. Ce module dépend(à besoin) des modules et controlleur - 'geolocation' & 'gservice'
var addCtrl = angular.module('addCtrl', ['geolocation', 'gservice']);
addCtrl.controller('addCtrl', function($scope, $http, $rootScope, geolocation, gservice){

    // Initialisation des variables
    // ----------------------------------------------------------------------------
    $scope.formData = {};
    var coords = {};
    var lat = 0;
    var long = 0;

    // Défini les coordonées initiale au centre de la belgique
    $scope.formData.latitude = 50.832;
    $scope.formData.longitude = 4.366;

    geolocation.getLocation().then(function(data){

        // Defini la latitude et la longitude
        coords = {lat:data.coords.latitude, long:data.coords.longitude};

        // Affiche les coordonnées (arrondies à 3 décimales) de l'endroit dans les input
        $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
        $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);

        // Affiche un message confirmant l'ajout des coordonnées réelles.
        $scope.formData.htmlverified = "Merci d'avoir communiqué votre localisation";

        gservice.refresh($scope.formData.latitude, $scope.formData.longitude);

    });

    // Fonctions
    // ----------------------------------------------------------------------------
    // Quand l'evenement click est détecté, on récupère les coordonées basées sur le click de la souris.
    $rootScope.$on("clicked", function(){

        // Lance le service "gservice" associé aux coordonnées identifiées
        $scope.$apply(function(){
            $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
            $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
            $scope.formData.htmlverified = "Données automatique précise non fournies";
        });
    });

	//Fn pour refresh la carte avec les coordonnées précises de l'user
	$scope.refreshLoc = function(){
		geolocation.getLocation().then(function(data){
			coords = {lat:data.coords.latitude, long:data.coords.longitude};

			$scope.formData.longitude = parseFloat(coords.long).toFixed(3);
			$scope.formData.latitude = parseFloat(coords.lat).toFixed(3);
			$scope.formData.htmlverified =  "Merci d'avoir communiqué votre localisation";
			gservice.refresh(coords.lat, coords.long);
		});
	};


    // Crée un nouveau restaurant basé sur les input du formulaire
    $scope.creerRestaurant = function() {

        // Récupere tous les champs de données
        var restoData = {
            nom: $scope.formData.nom,
            type: $scope.formData.type,
            location: [$scope.formData.longitude, $scope.formData.latitude],
            htmlverified: $scope.formData.htmlverified
        };

        //Insère le restaurant dans la base de données
        $http.post('/restos', restoData)
            .success(function (data) {

                // Une fois terminé on vide les champs texte sauf les coordonnées
                $scope.formData.nom = "";
                $scope.formData.type = "";

                // Rafraichir la carte avec les nouvelles données
                gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
            })
            .error(function (data) {
                console.log('Error: ' + data.message);
            });
    };
});
