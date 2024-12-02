const express = require('express');
const Resource = require('../models/resource'); // Importerar modellen.
const router = express.Router();

// GET: Hämta alla resurser
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find(); // Hämta alla resurser.
    res.status(200).json(resources);         // Returnera resurser i JSON-format.
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST: Skapa en ny resurs
router.post('/', async (req, res) => {
  const { title, description, link } = req.body; // Extrahera data från request body.
  try {
    const newResource = new Resource({ title, description, link });
    await newResource.save();                   // Spara resursen i databasen.
    res.status(201).json(newResource);          // Returnera den skapade resursen.
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// PUT: Uppdatera en resurs
router.put('/:id', async (req, res) => {
  const { id } = req.params;                   // Extrahera resurs-ID från URL.
  const { title, description, link } = req.body;
  try {
    const updatedResource = await Resource.findByIdAndUpdate(
      id, { title, description, link }, { new: true }
    );
    if (!updatedResource) return res.status(404).json({ message: 'Resource not found' });
    res.status(200).json(updatedResource);
  } catch (error) {
    res.status(400).json({ message: 'Invalid update data' });
  }
});

// DELETE: Ta bort en resurs
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedResource = await Resource.findByIdAndDelete(id);
    if (!deletedResource) return res.status(404).json({ message: 'Resource not found' });
    res.status(200).json({ message: 'Resource deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;