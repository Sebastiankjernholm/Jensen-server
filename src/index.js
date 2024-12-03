const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const dogBreedRoutes = require('./routes/dogBreedRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

// Middleware
const path = require('path');
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors());             
app.use(express.json());    

// Logga inkommande förfrågningar för rutter
app.use('/api/dogs', (req, res, next) => {
  console.log('Request to /api/dogs');
  next();
});

// API-routes för hundraser
app.use('/api/dogs', dogBreedRoutes); // Kopplar hundraser-routes till URL-prefixet "/api/dog-breeds"


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});