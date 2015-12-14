// Dependences
var mongoose        = require('mongoose');
var Restos            = require('./model.js');

// Definition des routes
module.exports = function(app) {

    //
    // --------------------------------------------------------
    // Récupère toutes les informations sur les restos dans la BDD
    app.get('/restos', function(req, res){
        //Utilise le schéma monggose pour effectuer la recherche (conditions vide - find({}))
        var query = Restos.find({});
        query.exec(function(err, restos){
            if(err)
                res.send(err);

            // Si pas d'erreurs on répond avec un JSON de tous les restaurants
            res.json(restos);
        });
    });

    // Routes  POST
    // --------------------------------------------------------
    // Méthode pour sauvegardes les nouveaux resto dans la base de données
    app.post('/restos', function(req, res){

		// Crée un nouveau restaurant basé sur le schéma mongoose et le body(contenu) de la requete POST
        var newresto = new Restos(req.body);

        // Le nouveau restaurants est sauvegardé dans la base de données
        newresto.save(function(err){
            if(err){
            //console.log(err.message);
            console.log(err);
            }

			// Si pas d'erreurs on répond avec un JSON de tous les restaurants
            res.json(req.body);
        });
    });




	//Récupère les enregistrements JSON de tous les restaurants qui répondent aux reglès de "requetage" ci dessous
	app.post('/requete/', function(req, res){

		//Récupérer tous les parametres de requete contenue dans le body de la réponse
		var lat             = req.body.latitude;
		var long            = req.body.longitude;
		var distance        = req.body.distance;
		var name         	= req.body.name;
		var pizza            = req.body.pizza;
		var frites          = req.body.frites;
		// var tout           = req.body.tout;
		// var reqVerified     = req.body.reqVerified;

		// Initialize une requete Mongoose génerique. La requete dépendra du body du POST
		var query = Restos.find({});

		// Filtrer par distance maximale (conversion de miles en metre -- SE DOCUMENTER LA DESSUS)
		if(distance){

			// Fonctionnalité de requetage géospatiale de MongoDB. ( Info: les coordonnéees c-a-d lat & lng sont inversées, c'est ainsi...)
			query = query.where('location').near({ center: {type: 'Point', coordinates: [long, lat]},
				//Conversion des metres en miles. Spécification de la géométrie "spherical" pour le globe
				maxDistance: distance * 1609.34, spherical: true});
		}

		if(name){
			//Avec expression régulière pour indiquer case insensitive :)
			query = query.find({'nom':{$regex: new RegExp('^' + name.toLowerCase(), 'i')}});
			//Pour compter le nombre de
			// .count()
		}

		// ...Filtre par type
		if(pizza || frites ){
			if(pizza){
				query.or([{ 'type': {$regex: new RegExp('^' + pizza.toLowerCase(), 'i')}}]);
			}
			if(frites){
				query.or([{ 'type': {$regex: new RegExp('^' + frites.toLowerCase(), 'i')}}]);
			}
		}

	//	// **************************************************************... EXEMPLE Autres requetes ici :

	//  // ...include filter by Min Age
	//  if(minAge){
	//  	query = query.where('age').gte(minAge);
	//  }

	//  // ...include filter by Max Age
	//  if(maxAge){
	//  	query = query.where('age').lte(maxAge);
	//  }

	//  // ...include filter by Favorite Language
	//  if(favLang){
	//  	query = query.where('favlang').equals(favLang);
	//  }

	//  // ...include filter for HTML5 Verified Locations
	//  if(reqVerified){
	//  	query = query.where('htmlverified').equals("Yep (Thanks for giving us real data!)");
	//  }


























		//Exécute la requete et renvoie le résultat de la requete
		query.exec(function(err, restos){
			if(err)
				res.send(err);

			//Si pas d'erreurs, reponse avec un JSON de tous les restaurants matchant les critères de recherche.
			res.json(restos);
		});
	});




};
