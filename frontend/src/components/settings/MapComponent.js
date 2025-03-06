import React, { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Rectangle,
  Marker,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import leaflet styles

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Make default Icon show up for Markers
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = ({ bounds, setExternalBounds }) => {
  // Calculate the center from initialBounds
  const centerLat = (bounds[0][0] + bounds[1][0]) / 2;
  const centerLon = (bounds[0][1] + bounds[1][1]) / 2;

  const [position, setPosition] = useState([centerLat, centerLon]); // State to track marker position

  const rectangleRef = useRef();
  const markerRef = useRef();

  useEffect(() => {
    if (rectangleRef.current) {
      // Update position when rectangle is dragged
      rectangleRef.current.on("drag", (e) => {
        const newBounds = e.target.getBounds();
        const newCenter = newBounds.getCenter();
        setExternalBounds(newBounds);
        setPosition([newCenter.lat, newCenter.lng]); // Update marker position to the center of the rectangle

        // Optionally, update external bounds
        if (setExternalBounds) {
          setExternalBounds(newBounds);
        }
      });
    }
  }, [bounds, setExternalBounds]); // This effect will run when bounds change
  useEffect(() => {
    const newCenterLat = (bounds[0][0] + bounds[1][0]) / 2;
    const newCenterLon = (bounds[0][1] + bounds[1][1]) / 2;
    setPosition([newCenterLat, newCenterLon]); // Set the initial marker position based on bounds
  }, [bounds]); // Re-run when bounds change

  return (
    <MapContainer
      center={position}
      zoom={2}
      style={{ width: "100%", minHeight: "100%", height: "100%" }}
      maxZoom={17}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Draggable Rectangle */}
      <Rectangle
        ref={rectangleRef}
        bounds={bounds}
        color="blue"
        weight={2}
        draggable={true}
      />

      {/* Marker placed at the center of the rectangle */}
      <Marker
        ref={markerRef}
        position={position}
        icon={DefaultIcon}
        draggable={true}
        eventHandlers={{
          dragend: (e) => {
            const newLatLng = e.target.getLatLng();
            const newBounds = [
              [newLatLng.lat - (bounds[1][0] - bounds[0][0]) / 2, newLatLng.lng - (bounds[1][1] - bounds[0][1]) / 2],
              [newLatLng.lat + (bounds[1][0] - bounds[0][0]) / 2, newLatLng.lng + (bounds[1][1] - bounds[0][1]) / 2],
            ];
            setPosition([newLatLng.lat, newLatLng.lng]); // Update marker position
            setExternalBounds(newBounds); // Update rectangle bounds based on the marker's new position

            // Optionally, update external bounds
            if (setExternalBounds) {
              setExternalBounds(newBounds);
            }
          },
        }}
      />
    </MapContainer>
  );
};

export default MapComponent;
