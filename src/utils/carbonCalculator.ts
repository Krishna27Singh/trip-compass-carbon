
import { TransportationType, ActivityType } from '@/types/itinerary';

// CO2 emissions in kg per passenger per km
const TRANSPORT_EMISSIONS: Record<TransportationType, number> = {
  walking: 0,
  bicycle: 0,
  car: 0.17, // Average car
  bus: 0.068, // Public bus
  train: 0.041, // Rail
  plane: 0.255 // Short-haul flight
};

// CO2 emissions in kg per activity type (approximate values)
const ACTIVITY_EMISSIONS: Record<ActivityType, number> = {
  sightseeing: 2.5,
  museum: 1.5,
  outdoors: 1.0,
  dining: 4.0,
  shopping: 3.0,
  entertainment: 3.5,
  relaxation: 1.0,
  freeTime: 2.0
};

// CO2 emissions in kg per night of accommodation
const ACCOMMODATION_EMISSIONS = {
  hotel: 15.5, // Luxury hotel
  bnb: 10.0, // B&B or smaller hotel
  hostel: 5.0, // Hostel
  camping: 2.0, // Camping
  apartment: 8.0 // Apartment rental
};

// Calculate transport emissions
export const calculateTransportEmissions = (
  type: TransportationType,
  distanceKm: number
): number => {
  return TRANSPORT_EMISSIONS[type] * distanceKm;
};

// Calculate activity emissions
export const calculateActivityEmissions = (
  type: ActivityType,
  durationHours: number
): number => {
  return ACTIVITY_EMISSIONS[type] * durationHours;
};

// Calculate accommodation emissions
export const calculateAccommodationEmissions = (
  type: 'hotel' | 'bnb' | 'hostel' | 'camping' | 'apartment',
  nights: number
): number => {
  return ACCOMMODATION_EMISSIONS[type] * nights;
};

// Calculate distance between two points using the Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

// Calculate carbon emission category
export const getCarbonCategory = (footprint: number): 'low' | 'medium' | 'high' => {
  if (footprint < 100) return 'low';
  if (footprint < 300) return 'medium';
  return 'high';
};

// Format carbon footprint
export const formatCarbonFootprint = (footprint: number): string => {
  return `${footprint.toFixed(2)} kg CO₂`;
};
