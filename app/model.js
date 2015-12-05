// Dependences
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
// Crée le schéma du restaurant
var RestoSchema = new Schema({
    nom: {type: String, required: true},
    type: {type: String, required: true},
    location: {type: [Number], required: true}, // [Long, Lat]
    htmlverified: String,
    reference: {type:String,unique:true},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

// Sets the created_at parameter equal to the current time
// Défini le created_at et une réference
RestoSchema.pre('save', function(next){
    now = new Date();
    reference="restaurant_"+this.nom+"_ondego_"+ Math.floor(Math.random()*1000000);
    this.updated_at = now;
    this.reference = reference;
    if(!this.created_at) {
        this.created_at = now
    }
next();
});

// Indexe le schéma sous forme "2dsphere" ( important pour des recherches de proximité)
RestoSchema.index({location: '2dsphere'});

// Exporte le RestoSchema pour qu'il soit utilisé autre part. Défini le nom de la collection à 'geoLoc2_resto'
module.exports = mongoose.model('geoLoc2_resto', RestoSchema);
