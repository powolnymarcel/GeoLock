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
};