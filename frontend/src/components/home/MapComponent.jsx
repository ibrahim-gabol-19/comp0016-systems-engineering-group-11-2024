import React, { useEffect, useState, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import leaflet styles
import { CompanyContext } from "../../context/CompanyContext";

const MapResizeFix = () => {
  const map = useMap();
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (map) {
        map.invalidateSize();
      }
    }, 500);
    return () => clearTimeout(timeoutId); // Clear the timeout on cleanup
  }, [map]);
  
  return null;
};

const MapComponent = ({ filters, dates, reports, events }) => {
  const navigate = useNavigate();
  const [filteredItems, setFilteredItems] = useState([]);
  const [mapCenter, setMapCenter] = useState([51.5074, -0.1278]); // Default center: London
  const [zoomLevel, setZoomLevel] = useState(6); // Default zoom level
  const { sw_lat, sw_lon, ne_lat, ne_lon } = useContext(CompanyContext);

  const [isContextLoaded, setIsContextLoaded] = useState(false); // Track if context data is loaded

  useEffect(() => {
    if (sw_lat && sw_lon && ne_lat && ne_lon) {
      setIsContextLoaded(true); // Set context data as loaded once bounds are available
    }
  }, [sw_lat, sw_lon, ne_lat, ne_lon]);

  const bounds = [
    [sw_lat, sw_lon], // Southwest coordinates
    [ne_lat, ne_lon], // Northeast coordinates
  ];

  useEffect(() => {
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

    const validEvents = events
      .filter((event) => event.latitude !== null && event.longitude !== null)
      .map((event) => ({
        id: event.id,
        name: event.title,
        type: "events",
        date: event.date,
        emoji: "📍", // Icon for events
        lat: parseFloat(event.latitude),
        lng: parseFloat(event.longitude),
        status: "active",
      }));


    const filtered = [...validReports, ...validEvents].filter((item) => {
      const isSelected =
        (filters.events && item.type === "events") ||
        (filters.issues && item.type === "issues" && item.status === "open");

      const isWithinDateRange =
        (!dates.from || new Date(item.date) >= new Date(dates.from)) &&
        (!dates.to || new Date(item.date) <= new Date(dates.to));

      return isSelected && isWithinDateRange;
    });

    setFilteredItems(filtered);
  }, [filters, dates, reports, events]);

  const handleRedirect = (item) => {
    if(item.type ==="issues"){
      navigate("/reporting", { state: { selectedIssue: item } });
    }
    else{
      navigate(`/events/${item.id}`);
    }
  };

  return (
    <div className="p-4 rounded-lg shadow-lg bg-white max-w-full mx-auto my-6" style={{ overflow: "hidden" }}>
      {isContextLoaded ? ( // Only render the map once context data is loaded
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
                    🔍 View {item.type === "issues"? "Report" : "Event"}
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <div>Loading map...</div> // Render loading state while context data is not available
      )}
    </div>
  );
};

export default MapComponent;
