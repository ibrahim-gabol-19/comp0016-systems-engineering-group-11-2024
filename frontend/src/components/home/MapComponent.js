import React, { useEffect, useState, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import leaflet styles
import { CompanyContext } from "../../context/CompanyContext";
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
  const { sw_lat, sw_lon, ne_lat, ne_lon } = useContext(CompanyContext);

  const bounds = [
    [sw_lat, sw_lon], // Southwest coordinates
    [ne_lat, ne_lon], // Northeast coordinates
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
        maxBounds={bounds} // Restrict map movement to company-defined bounds
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
    html: `<span style="font-size: 20px;">${item.emoji || "⚠️"}</span>`,
  })}
>
  <Popup offset={[0, -10]}> {/* Adjusts popup position */}
    <div className="p-2 w-48 text-sm">
      <h3 className="text-base font-semibold text-gray-800">{item.name}</h3>

      {item.tags && (
        <div className="bg-gray-200 text-gray-700 text-xs font-medium px-1 py-0.5 rounded mt-1">
          #{item.tags}
        </div>
      )}

      <button
        onClick={() => handleRedirect(item)}
        className="mt-2 w-full bg-blue-500 text-white text-xs font-medium py-1 rounded transition-all duration-200 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
      >
        🔍 View Report
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
