import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [filteredItems, setFilteredItems] = useState([]);
  const [mapCenter, setMapCenter] = useState([51.5074, -0.1278]); // Default center: London
  const [zoomLevel, setZoomLevel] = useState(6); // Default zoom level

  const ukBounds = [
    [49.5, -8], // Southwest UK
    [60, 2], // Northeast UK
  ];

  useEffect(() => {
    console.log("Reports in MapComponent:", reports);

    setMapCenter([51.5074, -0.1278]);
    setZoomLevel(6);

    const validReports = reports
      .filter(report => report.latitude !== undefined && report.longitude !== undefined)
      .map(report => ({
        id: report.id,
        name: report.title, 
        type: "issues", 
        date: report.published_date || "Unknown Date",
        emoji: "⚠️", // Default emoji
        lat: parseFloat(report.latitude), 
        lng: parseFloat(report.longitude),
        status: report.status,
        tags: report.tags,
      }));

    console.log("Filtered API Data for Map:", validReports);

    const filtered = validReports.filter((item) => {
      const isSelected =
        (filters.events && item.type === "events") ||
        (filters.issues && item.type === "issues" && item.status === "open");

      const isWithinDateRange =
        (!dates.from || new Date(item.date) >= new Date(dates.from)) &&
        (!dates.to || new Date(item.date) <= new Date(dates.to));

      return isSelected && isWithinDateRange;
    });

    setFilteredItems(filtered);
  }, [filters, dates, reports]);

  const handleRedirect = (issue) => {
    navigate("/reporting", { state: { selectedIssue: issue } });
  };

  return (
    <div className="p-4 rounded-lg shadow-lg bg-white max-w-full mx-auto my-6" style={{ overflow: "hidden" }}>
      <MapContainer
        center={mapCenter}
        zoom={zoomLevel}
        style={{ width: "100%", height: "500px", zIndex: 0 }}
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
            <Popup>
              <div>
                <h3>{item.name}</h3>
                <button
                  onClick={() => handleRedirect(item)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
                >
                  View Report
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
