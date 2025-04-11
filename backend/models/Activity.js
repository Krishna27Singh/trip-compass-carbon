
const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { 
    type: String, 
    enum: ['sightseeing', 'museum', 'outdoors', 'dining', 'shopping', 'entertainment', 'relaxation', 'freeTime'],
    required: true 
  },
  location: {
    name: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String }
  },
  startTime: { type: String, default: '09:00' },
  endTime: { type: String, default: '11:00' },
  cost: { type: Number, default: 0 },
  currency: { type: String, default: 'INR' },
  pictures: [String],
  destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' },
  carbonFootprint: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Activity', ActivitySchema);
