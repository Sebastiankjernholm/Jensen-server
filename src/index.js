const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/apiRoutes');

dotenv.config(); // Laddar miljövariabler från .env.
const app = express();
const PORT = process.env.PORT || 5001;

// Anslut till databasen
connectDB();

// Middleware
app.use(cors());              // Aktiverar CORS.
app.use(express.json());      // Gör att servern kan läsa JSON-data från request body.

// Routes
app.use('/api/resources', apiRoutes); // Kopplar API-routes till URL-prefixet "/api/resources".



// Starta servern
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});