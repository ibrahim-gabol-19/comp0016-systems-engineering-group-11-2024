import React, { useContext } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import leaflet styles

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { CompanyContext } from "../../../../context/CompanyContext";
// Make default Icon show up for Markers
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 16],
});

L.Marker.prototype.options.icon = DefaultIcon;

// The filter function to search within item fields
const filterItems = (
  items,
  userQuery,
  itemFields = ["title", "description"]
) => {
  const query = userQuery.toLowerCase();
  return (items || []).filter((item) => {
    return itemFields.some((field) =>
      item[field]?.toLowerCase().includes(query)
    );
  });
};

const MapComponent = ({ onMarkerSelected, reports, filter, userQuery }) => {
  const zoomLevel = 13;
  const { sw_lat, sw_lon, ne_lat, ne_lon } = useContext(CompanyContext);

  const bounds = [
    [sw_lat, sw_lon], // Southwest coordinates
    [ne_lat, ne_lon], // Northeast coordinates
  ];

  // Filter the reports based on the status and user query
  const filteredReports = filterItems(
    reports.filter((item) => item.status === filter),
    userQuery
  );

  return (
    <MapContainer
      center={[0, 0]}
      zoom={zoomLevel}
      style={{ width: "100%", minHeight: "100%", height: "100%" }}
      maxBounds={bounds} // Restrict map movement to Company-Define bounds
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
    </MapContainer>
  );
};

export default MapComponent;
