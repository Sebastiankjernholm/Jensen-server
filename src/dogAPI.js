const axios = require('axios');

require('dotenv').config();

const getDogBreeds = async () => {
  try {
    const response = await axios.get('https://api.thedogapi.com/v1/breeds', {
      headers: {
        'x-api-key': process.env.API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dog breeds:', error);
    return [];
  }
};

module.exports = getDogBreeds;