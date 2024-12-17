import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import leaflet styles

const MapComponent = ({ filters, dates }) => {
  const [filteredItems, setFilteredItems] = useState([]);
  const [mapCenter, setMapCenter] = useState([51.5074, -0.1278]); // Default center of the UK (London)
  const [zoomLevel, setZoomLevel] = useState(6); // Default zoom level for the UK

  // Simulate fetching and filtering data based on selected filters and dates
  useEffect(() => {
    const fetchFilteredData = () => {
      const data = [
        { id: 1, name: "Volunteering Event", type: "volunteering", date: "2024-12-15", emoji: "🙌", lat: 51.5074, lng: -0.1278 }, // London
        { id: 2, name: "News Update", type: "news", date: "2024-12-10", emoji: "📰", lat: 53.4084, lng: -2.9916 }, // Manchester
        { id: 3, name: "Local Issue", type: "issues", date: "2024-12-14", emoji: "⚠️", lat: 52.4862, lng: -1.8904 }, // Birmingham
        { id: 4, name: "Community Event", type: "events", date: "2024-12-12", emoji: "📍", lat: 51.4545, lng: -2.5879 }, // Bristol
        { id: 5, name: "Volunteering Event", type: "volunteering", date: "2024-12-13", emoji: "🙌", lat: 55.9533, lng: -3.1883 }, // Edinburgh
        { id: 6, name: "News Update", type: "news", date: "2024-12-16", emoji: "📰", lat: 53.4080, lng: -2.2389 }, // Liverpool
        { id: 7, name: "Local Issue", type: "issues", date: "2024-12-17", emoji: "⚠️", lat: 52.2053, lng: 0.1218 }, // Cambridge
        { id: 8, name: "Community Event", type: "events", date: "2024-12-11", emoji: "📍", lat: 51.5076, lng: -0.1280 }, // London (another spot)
      ];

      const filtered = data.filter((item) => {
        // Filter based on selected filters
        const isSelected =
          (filters.volunteering && item.type === "volunteering") ||
          (filters.events && item.type === "events") ||
          (filters.news && item.type === "news") ||
          (filters.issues && item.type === "issues");

        // Filter by date range
        const isWithinDateRange = (!dates.from || new Date(item.date) >= new Date(dates.from)) &&
                                  (!dates.to || new Date(item.date) <= new Date(dates.to));

        return isSelected && isWithinDateRange;
      });

      setFilteredItems(filtered);
    };

    fetchFilteredData();
  }, [filters, dates]); // Re-run filter logic when filters or dates change

  const ukBounds = [
    [49.5, -8],  // Southwest coordinates (approx.)
    [60, 2],     // Northeast coordinates (approx.)
  ];

  return (
    <div className="p-4 rounded-lg shadow-lg bg-white max-w-full mx-auto my-6">
      <MapContainer
        center={mapCenter}
        zoom={zoomLevel}
        style={{ width: "100%", height: "500px" }}
        maxBounds={ukBounds} // Restrict map movement to UK
        maxBoundsViscosity={1.0} // Ensures map stays within bounds
        minZoom={8} // Set minimum zoom level to allow zooming in further
        maxZoom={12} // Set maximum zoom level to zoom in further
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {filteredItems.map((item) => (
          <Marker
            key={item.id}
            position={[item.lat, item.lng]}
            icon={new L.DivIcon({
              className: 'emoji-icon',
              html: `<span style="font-size: 30px;">${item.emoji}</span>`, // Using emoji as the icon
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
