
const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  imageUrl: {
    type: String
  },
  address: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Destination', destinationSchema);
