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




	// Retrieves JSON records for all users who meet a certain set of query conditions
	app.post('/requete/', function(req, res){

		// Grab all of the query parameters from the body.
		var lat             = req.body.latitude;
		var long            = req.body.longitude;
		var distance        = req.body.distance;

		// Opens a generic Mongoose Query. Depending on the post body we will...
		var query = Restos.find({});

		// ...include filter by Max Distance (converting miles to meters)
		if(distance){

			// Using MongoDB's geospatial querying features. (Note how coordinates are set [long, lat]
			query = query.where('location').near({ center: {type: 'Point', coordinates: [long, lat]},

				// Converting meters to miles. Specifying spherical geometry (for globe)
				maxDistance: distance * 1609.34, spherical: true});
		}

		// ... Other queries will go here ...

		// Execute Query and Return the Query Results
		query.exec(function(err, users){
			if(err)
				res.send(err);

			// If no errors, respond with a JSON of all users that meet the criteria
			res.json(users);
		});
	});


};
