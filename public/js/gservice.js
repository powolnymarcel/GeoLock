// Créer le factory "gservice". Ce sera le service principal pour interagir avec la carte
angular.module('gservice', [])
	//La factory a besoin du service $http
    .factory('gservice', function($rootScope, $http){


        // Initialisation des variables
        // -------------------------------------------------------------
        // Le service que notre factory va renvoyer
        var googleMapService = {};

        // Tableau de coordonnées obtenu à l'aide des appels API
        var locations = [];

		// Variables qui seront utilisées pour nous aider à placer le marqueur
        var lastMarker;
        var currentSelectedMarker;

		// Localisation par défaut ( initialisée au centre de la Belgique)
        var selectedLat = 50.832;
        var selectedLong = 4.366;

		// Gestion des "clicks de localisation"
        googleMapService.clickLat  = 0;
        googleMapService.clickLong = 0;

        // Fonctions
        // --------------------------------------------------------------
		//Rafraichi la carte avec de nouvelles données. La fonction prend en paramètre la nvlle latitude et longitude
        googleMapService.refresh = function(latitude, longitude,lesRequetesResultats){

			//Vide le tableau contenant les localisations
            locations = [];

			// Défini la latitude et la longitude à celle reçue avec l'appel de "refresh()"
            selectedLat = latitude;
            selectedLong = longitude;


			//Si une requete filtrée est appellée dans refresh()
			if (lesRequetesResultats){

				//Alors convertir la requete filtrée en localisation
				locations = convertToMapPoints(lesRequetesResultats);

				//Ensuite initialiser la carte
				initialize(latitude, longitude, true);
			}
		else{

			// Effectue un appel AJAX et recupères les données de la collection resto
            $http.get('/restos').success(function(response){

				//Converti le résultats dans un format googleMap
                locations = convertToMapPoints(response);
				console.log(locations);
				//Ensuite initialisation de la carte
                initialize(latitude, longitude);
            }).error(function(){}
			);
        }
	};
        // Fonctions privées
        // --------------------------------------------------------------
		// Converti les localisation JSON des restaurants en coordonées pour la carte
        var convertToMapPoints = function(response){

			//Vide le tableau contenant les localisations
            var locations = [];

			//Itère à travers toutes les entrées JSON reçues dans la réponse
            for(var i= 0; i < response.length; i++) {
                var resto = response[i];

				//Crée une mini fenetre popup pour chaque restaurant
                var  contentString =
                    '<p><b>nom</b>: ' + resto.nom +
                    '<br><b>type</b>: ' + resto.type +
					'<br><img src="http://www.pizzaandiamochauny.fr/images/gallery/offres.png" style="width:30% "/>'+
                    '<br><br><a href="/restaurant/'+resto.nom+'" class="btn btn-default">Voir</a>' +
					'</p>';

				//Converti chaque restaurants au format JSON en coordonnées googleMaps (Rappel du format [Lat, Lng] format[c'est inversé...]).
                locations.push({
                    latlon: new google.maps.LatLng(resto.location[1], resto.location[0]),
                    message: new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 320
                    }),
                    nom: resto.nom,
                    type: resto.type
            });
        }
			//La variable est maintenant un tableau rempli de restaurants
        return locations;
    };

//initialiser la carte
var initialize = function(latitude, longitude,filtre) {

	//Utilise la latitude , longitude selectionnée en point de départ
    var myLatLng = {lat: selectedLat, lng: selectedLong};

    // Si la carte n'a pas déjà étéé créee
    if (!map){

		//Crée un nouvelle carte et la placer dans le template index.html
        var map = new google.maps.Map(document.getElementById('map-canvas'), {
            zoom: 8,
            center: myLatLng
        });
    }


	//Si une requete filtrée a été utilisée choix de l'iconne
	if(filtre){
		icon = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
	}
	else{
		icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
	}

	//Itère sur chaque restaurants et place un marqueur
    locations.forEach(function(n, i){
        var marker = new google.maps.Marker({
            position: n.latlon,
            map: map,
            title: "Big Map",
            icon: "https://webapps-cdn.esri.com/graphics/poi-icons/restaurant.png",
        });

		//Pour chaque marqueur crée, ajoute un listener et check les clicks
        google.maps.event.addListener(marker, 'click', function(e){

			//Quand un click est detecté, ouvrir le message du marqueur
            currentSelectedMarker = n;
            n.message.open(map, marker);
        });
    });

	//Défini la localisation actuelle avec un personnage qui saute
    var initialLocation = new google.maps.LatLng(latitude, longitude);
    var marker = new google.maps.Marker({
        position: initialLocation,
        animation: google.maps.Animation.BOUNCE,
        map: map,
		icon: 'http://image.noelshack.com/fichiers/2012/30/1343166017-user.png',
		draggable:true
    });

	//Ajouter un rayon?????
//************************************************************
// Add circle overlay and bind to marker
//	var circle = new google.maps.Circle({
//		map: map,
//		radius: 16093,    // 10 miles in metres
//		fillColor: '#AA0000',
//		strokeColor: '#FF0000',
//		strokeOpacity: 0.8,
//		strokeWeight: 2,
//		fillOpacity: 0.35
//
//	});
//
//	circle.bindTo('center', marker, 'position');
//    lastMarker = marker;
//************************************************************

	lastMarker = marker;

	//Fonction pour se déplacer à la localisation selectionnée
    map.panTo(new google.maps.LatLng(latitude, longitude));

	//Cliquer sur la carte déplace transforme le personnage sautant en marqueur rouge
    google.maps.event.addListener(map, 'click', function(e){
        var marker = new google.maps.Marker({
            position: e.latLng,
            animation: google.maps.Animation.BOUNCE,
            map: map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
			draggable:true

		});

		//Quand un nouvelle localisation  est selectionné, on supprime le personnage sautant
        if(lastMarker){
            lastMarker.setMap(null);
        }

		//Crée un nouveau personnage sautant et on se focus dessus
        lastMarker = marker;
        map.panTo(marker.position);

		//Mets à jour la variable de broadcast (permet de montrer les coordonnées dans les input)
        googleMapService.clickLat = marker.getPosition().lat();
        googleMapService.clickLong = marker.getPosition().lng();
        $rootScope.$broadcast("clicked");
    });

};

// Refresh the page upon window load. Use the initial latitude and longitude
		//Au chargement complet de la page, on refresh la carte, Utilise la latitude et longitude initiale (centre de la Belgique)
google.maps.event.addDomListener(window, 'load',
    googleMapService.refresh(selectedLat, selectedLong));

return googleMapService;
});

