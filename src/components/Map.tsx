
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Activity, Location, Transportation } from "@/types/itinerary";

// Fix Leaflet icon issue
// This is needed because of how Leaflet handles icons in modern JS bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

// Custom marker icons
const activityIcon = new L.Icon({
  iconUrl: "/activity-marker.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface MapProps {
  locations: any;
  transportations?: any[];
  center?: LatLngExpression;
  zoom?: number;
  height?: string;
  className?: string;
}

const Map: React.FC<MapProps> = ({
  locations,
  transportations = [],
  center,
  zoom = 12,
  height = "400px",
  className = "",
}) => {
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([51.505, -0.09]);
  const [mapZoom, setMapZoom] = useState<number>(zoom);

  // Calculate center based on locations
  useEffect(() => {
    if (center) {
      setMapCenter(center);
    } else if (locations && locations.length > 0) {
      // If no center is provided, calculate the average of all locations
      const sumLat = locations.reduce((sum: number, loc: Location) => sum + loc.lat, 0);
      const sumLng = locations.reduce((sum: number, loc: Location) => sum + loc.lng, 0);
      
      setMapCenter([sumLat / locations.length, sumLng / locations.length]);
      
      // Adjust zoom based on number of locations
      if (locations.length === 1) {
        setMapZoom(14);
      } else if (locations.length > 5) {
        setMapZoom(10);
      } else {
        setMapZoom(12);
      }
    }
  }, [locations, center]);

  return (
    <MapContainer
      style={{ height, width: "100%" }}
      center={mapCenter as LatLngExpression}
      zoom={mapZoom}
      scrollWheelZoom={false}
      className={className}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Render markers for each location */}
      {locations?.map((location: Location, index: number) => (
        <Marker
          key={`location-${index}-${location.id || location.name}`}
          position={[location.lat, location.lng]}
        >
          <Popup>
            <div>
              <h3 className="font-semibold">{location.name}</h3>
              {location.address && <p className="text-sm">{location.address}</p>}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Render transportation routes */}
      {transportations?.map((transportation: Transportation, index: number) => (
        <React.Fragment key={`transport-${index}`}>
          <Polyline
            positions={[
              [transportation.from.lat, transportation.from.lng],
              [transportation.to.lat, transportation.to.lng],
            ]}
            pathOptions={{ color: "#3B82F6", weight: 3, opacity: 0.7, dashArray: "5, 10" }}
          />
        </React.Fragment>
      ))}
    </MapContainer>
  );
};

export default Map;
