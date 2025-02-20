import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Rectangle, // Import Rectangle
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import leaflet styles

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Make default Icon show up for Markers
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 16]
});

L.Marker.prototype.options.icon = DefaultIcon;

// The filter function to search within item fields
const filterItems = (items, userQuery, itemFields = ['title', 'description']) => {
  const query = userQuery.toLowerCase();
  return (items || []).filter((item) => {
    return itemFields.some(field =>
      item[field]?.toLowerCase().includes(query)
    );
  });
};



const MapComponent = ({ bounds}) => {
  const mapCenter = [
    (bounds[0][0] + bounds[1][0]) / 2, // Average of latitudes (swLat + neLat) / 2
    (bounds[0][1] + bounds[1][1]) / 2, // Average of longitudes (swLon + neLon) / 2
  ];  
  console.log(mapCenter);// const mapCenter = [1, 2]/;
  const zoomLevel = 1;



  return (
    <MapContainer
      center={mapCenter}
      zoom={zoomLevel}
      style={{ width: "100%", minHeight: "100%", height: "100%" }}
      // maxBounds={bounds} // Restrict map movement to UK
      maxBoundsViscosity={1.0} // Ensures map stays within bounds
      minZoom={1} // Set minimum zoom level to allow zooming in further
      maxZoom={17} // Set maximum zoom level to zoom in further
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Draw the rectangle around the bounds */}
      <Rectangle       draggable={true} bounds={bounds} color="blue" weight={2} />
    </MapContainer>
  );
};

export default MapComponent;
