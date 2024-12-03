const mongoose = require('mongoose');

const dogBreedSchema = new mongoose.Schema({
  name: { type: String, required: true },       
  temperament: { type: String },                 
  life_span: { type: String },                   
  image: { type: String },                       
}, { timestamps: true });


module.exports = mongoose.model('DogBreed', dogBreedSchema);