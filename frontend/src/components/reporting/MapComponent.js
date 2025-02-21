import React, { useState, useContext} from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import leaflet styles


import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { CompanyContext } from "../../context/CompanyContext";
// Make default Icon show up for Markers
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 16]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = ({ onMarkerSelected, onNewMarkerSelected, reports, newMarker, filter }) => {
  const zoomLevel = 13;
  const [position, setPosition] = useState(null);
  const { sw_lat, sw_lon, ne_lat, ne_lon } = useContext(CompanyContext);

  const bounds = [
    [sw_lat, sw_lon], // Southwest coordinates
    [ne_lat, ne_lon], // Northeast coordinates
  ];

  function NewReport() {
    const map = useMapEvents({
      click(e) {
        // Close any open popups
        map.closePopup();

        // Update position for the new marker
        setPosition(e.latlng);

        // Optionally, fly to the clicked location
        map.flyTo(e.latlng, map.getZoom());

        // Notify parent component of new marker
        onNewMarkerSelected(e);
      },
      locationfound(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());

      },
    });

    return newMarker === null ? null : (
      <Marker
        position={position}
        draggable={true}

      >
      </Marker>
    );
  }

  const filteredReports = reports.filter((item) => item.status === filter);

  return (
    <MapContainer
      center={[0,0]}
      zoom={zoomLevel}
      style={{ width: "100%", minHeight: "100%", height: "100%" }}
      maxBounds={bounds} 
      maxBoundsViscosity={1.0} // Ensures map stays within bounds
      minZoom={8} // Set minimum zoom level to allow zooming in further
      maxZoom={17} // Set maximum zoom level to zoom in further
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {filteredReports.map((item) => (
        <Marker
          key={item.id}
          position={[item.latitude, item.longitude]}
          eventHandlers={{
            click: () => {
              onMarkerSelected(item);
            },
          }}
        />
      ))}
      <NewReport />
    </MapContainer>
  );
};

export default MapComponent;
