
const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  description: { type: String },
  imageUrl: { type: String }
});

const ActivitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['sightseeing', 'museum', 'outdoors', 'dining', 'shopping', 'entertainment', 'relaxation', 'freeTime'],
    required: true 
  },
  location: { type: LocationSchema, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  description: { type: String },
  cost: { type: Number, default: 0 },
  carbonFootprint: { type: Number, default: 0 },
  weatherSensitive: { type: Boolean, default: false }
});

const DaySchema = new mongoose.Schema({
  date: { type: String, required: true },
  activities: [ActivitySchema],
  totalCost: { type: Number, default: 0 },
  isOverBudget: { type: Boolean, default: false }
});

const TransportationSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['walking', 'bicycle', 'car', 'bus', 'train', 'plane'],
    required: true 
  },
  from: { type: LocationSchema, required: true },
  to: { type: LocationSchema, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  cost: { type: Number, default: 0 },
  carbonFootprint: { type: Number, required: true }
});

const AccommodationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: LocationSchema, required: true },
  checkIn: { type: String, required: true },
  checkOut: { type: String, required: true },
  cost: { type: Number, default: 0 },
  carbonFootprint: { type: Number, required: true }
});

const BudgetSchema = new mongoose.Schema({
  total: { type: Number, required: true },
  accommodations: { type: Number, required: true },
  transportation: { type: Number, required: true },
  activities: { type: Number, required: true },
  food: { type: Number, required: true },
  misc: { type: Number, default: 0 },
  dailyLimit: { type: Number },
  currency: { type: String, default: 'INR', required: true }
});

const TripPreferencesSchema = new mongoose.Schema({
  preferences: [{ 
    type: String, 
    enum: ['adventure', 'relaxation', 'culture', 'nightlife', 'nature', 'art', 'food'] 
  }],
  pace: { 
    type: String, 
    enum: ['relaxed', 'moderate', 'busy'],
    default: 'moderate' 
  },
  budget: { type: BudgetSchema, required: true }
});

const ItinerarySchema = new mongoose.Schema({
  title: { type: String, required: true },
  destination: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  days: [DaySchema],
  accommodations: [AccommodationSchema],
  transportations: [TransportationSchema],
  preferences: { type: TripPreferencesSchema, required: true },
  totalCarbonFootprint: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Itinerary', ItinerarySchema);
