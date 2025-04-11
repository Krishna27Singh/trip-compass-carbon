
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const destinationRoutes = require('./routes/destinationRoutes');
const activityRoutes = require('./routes/activityRoutes');
const weatherRoutes = require('./routes/weatherRoutes');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/destinations', destinationRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/weather', weatherRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Trip Compass Carbon API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
