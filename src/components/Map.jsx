
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// This component handles map center and zoom changes
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center && center.length === 2) {
      map.setView(center, zoom);
    }
  }, [map, center, zoom]);
  
  return null;
};

const ItineraryMap = ({ locations = [], transportations = [], height = '400px', className = '' }) => {
  const [mapCenter, setMapCenter] = useState([0, 0]);
  const [mapZoom, setMapZoom] = useState(2);

  // Calculate map center based on locations
  useEffect(() => {
    if (locations && locations.length > 0) {
      // Find center of all markers
      const lats = locations.map(loc => loc.lat);
      const lngs = locations.map(loc => loc.lng);
      
      const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
      const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
      
      setMapCenter([avgLat, avgLng]);
      
      // Adjust zoom level based on marker spread
      const latRange = Math.max(...lats) - Math.min(...lats);
      const lngRange = Math.max(...lngs) - Math.min(...lngs);
      const maxRange = Math.max(latRange, lngRange);
      
      if (maxRange < 0.1) setMapZoom(13);
      else if (maxRange < 0.5) setMapZoom(11);
      else if (maxRange < 2) setMapZoom(9);
      else if (maxRange < 5) setMapZoom(7);
      else if (maxRange < 10) setMapZoom(6);
      else setMapZoom(4);
    }
  }, [locations]);
  
  // Generate transportation lines
  const transportationLines = transportations?.map(transport => {
    if (!transport.origin || !transport.destination) return null;
    
    return {
      positions: [
        [transport.origin.lat, transport.origin.lng],
        [transport.destination.lat, transport.destination.lng]
      ],
      color: transport.type === 'flight' ? '#FF6B6B' : 
             transport.type === 'train' ? '#4ECDC4' : 
             transport.type === 'bus' ? '#FFD166' : '#1A535C'
    };
  }).filter(line => line !== null);
  
  return (
    <div style={{ height, width: '100%' }} className={className}>
      <MapContainer 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
        className="rounded-md"
        // We no longer pass center and zoom props directly to MapContainer as they're not part of its types
        // Instead, we use the default values and update via MapUpdater component
        zoom={2}
        center={[0, 0]}
      >
        <MapUpdater center={mapCenter} zoom={mapZoom} />
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />
        
        {locations?.map((location, index) => (
          <Marker 
            key={location.id || index} 
            position={[location.lat, location.lng]}
          >
            <Popup>
              <div className="font-medium">{location.name}</div>
            </Popup>
          </Marker>
        ))}
        
        {transportationLines?.map((line, index) => (
          <Polyline 
            key={index}
            positions={line.positions}
            color={line.color}
            weight={3}
            opacity={0.7}
            dashArray="5,10"
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default ItineraryMap;
