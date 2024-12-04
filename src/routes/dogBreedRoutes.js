const express = require('express');
const getDogBreeds = require('../dogAPI'); 
const DogBreed = require('../models/dogBreed'); 
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => { 
  console.log('GET /api/dogs hit');  
  try {
      // Hämta hundraser från databasen
      const dogBreeds = await DogBreed.find();

      if (!dogBreeds || dogBreeds.length === 0) {
          return res.status(404).json({ message: 'No dog breeds found in the database.' });
      }

      const dogApiResponse = await axios.get('https://api.thedogapi.com/v1/breeds');
      const dogApiData = dogApiResponse.data;

      const enrichedDogBreeds = dogBreeds.map(dog => {
          const matchingDogApi = dogApiData.find(apiDog => apiDog.name === dog.name);
          
          const imageUrl = matchingDogApi && matchingDogApi.image ? matchingDogApi.image.url : 'https://via.placeholder.com/150?text=No+Image';
          
          return {
              ...dog.toObject(),
              image: dog.image || imageUrl // Använd fallback-bild om ingen bild finns
          };
      });

      // Skicka tillbaka hundraserna
      res.status(200).json(enrichedDogBreeds);
  } catch (error) {
      console.error('Error fetching dog breeds:', error);
      res.status(500).json({ message: 'Error fetching dog breeds' });
  }
});

router.post('/', async (req, res) => {
    try {
      const { name, temperament, life_span, image } = req.body;
  
      const newDogBreed = new DogBreed({
        name,
        temperament,
        life_span,
        image,
      });
  
      await newDogBreed.save();
  
      // Skicka tillbaka ett svar om att hundrasen har sparats
      res.status(201).json({
        message: 'Dog breed created successfully!',
        dogBreed: newDogBreed,
      });
    } catch (error) {
      console.error('Error saving dog breed:', error);
      res.status(500).json({ message: 'Error saving dog breed' });
    }
  });

router.put('/:id', async (req, res) => {
    try {
      const dogBreed = await DogBreed.findByIdAndUpdate(
        req.params.id, 
        req.body,     
        { new: true, runValidators: true } 
      );
  
    
      if (!dogBreed) {
        return res.status(404).json({ message: 'Dog breed not found' });
      }
  
      // Om uppdateringen lyckades, skicka tillbaka den uppdaterade hundrasen
      res.status(200).json(dogBreed);
    } catch (error) {
      console.error('Error updating dog breed:', error);
      res.status(500).json({ message: 'Error updating dog breed' });
    }
  });


router.delete('/:id', async (req, res) => {
    try {
      const dogBreed = await DogBreed.findByIdAndDelete(req.params.id);
  
      
      if (!dogBreed) {
        return res.status(404).json({ message: 'Dog breed not found' });
      }
  
      // Om borttagningen lyckades, skicka tillbaka ett meddelande
      res.status(200).json({ message: 'Dog breed deleted' });
    } catch (error) {
      console.error('Error deleting dog breed:', error);
      res.status(500).json({ message: 'Error deleting dog breed' });
    }
  });

module.exports = router;