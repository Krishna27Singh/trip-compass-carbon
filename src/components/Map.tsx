
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Location, Transportation } from '@/types/itinerary';

// Marker icons by transportation type
const transportIcons = {
  walking: '🚶',
  bicycle: '🚲',
  car: '🚗',
  bus: '🚌',
  train: '🚆',
  plane: '✈️'
};

// Component to set map view
const MapCenter = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const ItineraryMap = ({
  locations,
  transportations = [],
  center,
  zoom = 12,
  height = '500px',
  className = ''
}) => {
  const [mapCenter, setMapCenter] = useState(
    center || (locations.length > 0 ? [locations[0].lat, locations[0].lng] : [51.505, -0.09])
  );

  useEffect(() => {
    // If center is not provided and we have locations, use the first location
    if (!center && locations.length > 0) {
      setMapCenter([locations[0].lat, locations[0].lng]);
    }
  }, [center, locations]);

  // Generate routes for transportations
  const routes = transportations.map(transport => ({
    id: transport.id,
    from: [transport.from.lat, transport.from.lng],
    to: [transport.to.lat, transport.to.lng],
    type: transport.type
  }));

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <MapContainer 
        style={{ height: '100%', width: '100%' }}
        center={mapCenter} 
        zoom={zoom} 
        scrollWheelZoom={false} 
        className="h-full w-full rounded-md shadow-md"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        
        <MapCenter center={mapCenter} zoom={zoom} />
        
        {/* Render markers for each location */}
        {locations.map(location => (
          <Marker 
            key={location.id} 
            position={[location.lat, location.lng]}
          >
            <Popup>
              <div className="text-sm">
                <h3 className="font-bold">{location.name}</h3>
                {location.address && <p>{location.address}</p>}
                {location.description && <p className="mt-1">{location.description}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Render routes between locations */}
        {routes.map(route => (
          <React.Fragment key={route.id}>
            <Polyline 
              positions={[route.from, route.to]} 
              pathOptions={{
                color: route.type === 'plane' ? '#ea4335' :
                        route.type === 'train' ? '#4285f4' :
                        route.type === 'car' ? '#fbbc05' : '#34a853',
                weight: 3,
                dashArray: route.type === 'plane' ? '5, 10' : route.type === 'train' ? '1, 5' : ''
              }}
            />
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};

export default ItineraryMap;
