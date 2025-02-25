import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import leaflet styles

const MapResizeFix = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 500);
  }, [map]);
  return null;
};

const MapComponent = ({ filters, dates, reports }) => {
  const [filteredItems, setFilteredItems] = useState([]);
  const [mapCenter, setMapCenter] = useState([51.5074, -0.1278]); // Default center: London
  const [zoomLevel, setZoomLevel] = useState(6); // Default zoom level

  const ukBounds = [
    [49.5, -8],  // Southwest UK
    [60, 2],     // Northeast UK
  ];

  useEffect(() => {
    console.log("Reports in MapComponent:", reports);

    setMapCenter([51.5074, -0.1278]);
    setZoomLevel(6);

    const data = [
      { id: 1, name: "Volunteering Event", type: "volunteering", date: "2024-12-15", emoji: "🙌", lat: 51.5074, lng: -0.1278 }, // London
      { id: 2, name: "News Update", type: "news", date: "2024-12-10", emoji: "📰", lat: 53.4084, lng: -2.9916 }, // Manchester
    ];

    // Merge dummy data and API reports
    const combinedData = [
      ...data, // Keep existing events
      ...reports.map(report => ({
        id: report.id,
        name: report.title, // Use report title
        type: "issues", // Assuming all reports are issues
        date: report.published_date || "Unknown Date",
        emoji: "⚠️", // Default emoji
        lat: parseFloat(report.latitude), // Ensure lat/lng are numbers
        lng: parseFloat(report.longitude),
        status: report.status,

        
      }))
    ];

    console.log("Combined Data for Map:", combinedData);

    const filtered = combinedData.filter((item) => {
      const isSelected =
        (filters.events && item.type === "events" ) ||
        (filters.issues && item.type === "issues" && item.status==="open");

      const isWithinDateRange =
        (!dates.from || new Date(item.date) >= new Date(dates.from)) &&
        (!dates.to || new Date(item.date) <= new Date(dates.to));

      return isSelected && isWithinDateRange;
    });

    setFilteredItems(filtered);
  }, [filters, dates, reports]);

  return (
    <div className="p-4 rounded-lg shadow-lg bg-white max-w-full mx-auto my-6" style={{ overflow: "hidden" }}>
      
      <MapContainer
        center={mapCenter}
        zoom={zoomLevel}
        style={{ width: "100%", height: "500px",zIndex:0 }}
        maxBounds={ukBounds}
        maxBoundsViscosity={1.0}
        minZoom={6}
        maxZoom={15}
      >
        <MapResizeFix /> {/* Fixes map resize issue */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {filteredItems.map((item) => (
          <Marker
            key={item.id}
            position={[item.lat, item.lng]} // Ensure lat/lng exist
            icon={new L.DivIcon({
              className: "emoji-icon",
              html: `<span style="font-size: 25px;">${item.emoji || "⚠️"}</span>`,
            })}
          >
            <Popup>{item.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
