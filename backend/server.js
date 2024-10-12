require('dotenv').config(); // Load environment variables

const express = require('express');
const bodyParser = require('body-parser');
const menteeRoutes = require('./menteeRoutes'); // Import routes

const app = express();
const port = process.env.PORT || 5000; // Use PORT from .env, fallback to 3000

// Middleware
app.use(bodyParser.json());

// Use the routes defined in menteeRoutes.js
app.use('/api', menteeRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Express server!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
