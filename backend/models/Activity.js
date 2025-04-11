
const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  address: {
    type: String
  },
  description: {
    type: String
  }
});

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['sightseeing', 'museum', 'outdoors', 'dining', 'shopping', 'entertainment', 'relaxation', 'freeTime'],
    required: true
  },
  location: {
    type: locationSchema,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  cost: {
    type: Number
  },
  carbonFootprint: {
    type: Number
  },
  weatherSensitive: {
    type: Boolean,
    default: false
  },
  destinationName: {
    type: String,
    required: true,
    index: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
