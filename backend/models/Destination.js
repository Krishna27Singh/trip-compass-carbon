
const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
  popularity: { type: Number, default: 0 },
  tags: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Destination', DestinationSchema);
