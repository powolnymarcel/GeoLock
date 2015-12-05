
// Dependences
// -----------------------------------------------------
var express         = require('express');
//*****************************
var path =require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
//*****************************
var mongoose        = require('mongoose');
var port            = process.env.PORT || 3000;
var morgan          = require('morgan');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var app             = express();



var db = mongoose.connection;
// -------------------------------_______________----- ICI AJOUTEZ VOS INFOS MONGOLAB !
var uri= "mongodb://geoloc:geoloc@ds061374.mongolab.com:61374/geoloc";

// MONGOOSE connectes toi sur Mongolab pour les DATA !
db = mongoose.connect(uri);

// Defini la connexion à mongoDB
//On se connecte à l'orm Mongoose en local
//mongoose.connect('mongodb://localhost/geoloc2');





//  Configuration d' Express
// -----------------------------------------------------

// Log et parsing
app.use(express.static(__dirname + '/public'));                 //Defini le dossier des assets public
app.use('/bower_components',  express.static(__dirname + '/bower_components')); // permet l'utilisation du dossier bower_components
app.use(morgan('dev'));                                         // Log du cli gràce à morgan
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.urlencoded({extended: true}));               // parse application/x-www-form-urlencoded
app.use(bodyParser.text());                                     // Permet à bodyParser de chercher du texte brut
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));  // parse application/vnd.api+json en tant que json
app.use(methodOverride());

// Routes
// ------------------------------------------------------
require('./app/routes.js')(app);

// Le serveur écoute
// -------------------------------------------------------
app.listen(port);
console.log('Le serveur écoute sur le port ' + port);
