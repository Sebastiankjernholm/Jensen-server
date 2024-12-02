const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },         // Resursens titel, obligatorisk.
  description: { type: String, required: true },  // En beskrivning av resursen.
  link: { type: String, required: true },         // Länk till resursen.
}, { timestamps: true }); // Skapar automatisk createdAt och updatedAt.

module.exports = mongoose.model('Resource', resourceSchema);