import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import leaflet styles

const MapComponent = ({ onMarkerSelected }) => {
  const [filteredItems, setFilteredItems] = useState([]);
  const [mapCenter, setMapCenter] = useState([51.5074, -0.1278]); // Default center of the UK (London)
  const [zoomLevel, setZoomLevel] = useState(6); // Default zoom level for the UK
  const data = [
    { id: 1, name: "Volunteering Event", type: "issues", date: "2024-12-15", emoji: "🙌", lat: 51.5074, lng: -0.1278 }, // London
    { id: 2, name: "News Update", type: "issues", date: "2024-12-10", emoji: "📰", lat: 53.4084, lng: -2.9916 }, // Manchester
    { id: 3, name: "Local Issue", type: "issues", date: "2024-12-14", emoji: "⚠️", lat: 52.4862, lng: -1.8904 }, // Birmingham
    { id: 4, name: "Community Event", type: "issues", date: "2024-12-12", emoji: "📍", lat: 51.4545, lng: -2.5879 }, // Bristol
    { id: 5, name: "Volunteering Event", type: "issues", date: "2024-12-13", emoji: "🙌", lat: 55.9533, lng: -3.1883 }, // Edinburgh
    { id: 6, name: "News Update", type: "issues", date: "2024-12-16", emoji: "📰", lat: 53.4080, lng: -2.2389 }, // Liverpool
    { id: 7, name: "Local Issue", type: "issues", date: "2024-12-17", emoji: "⚠️", lat: 52.2053, lng: 0.1218 }, // Cambridge
    { id: 8, name: "Community devent", type: "issues", status:"open", tags: "Environmental", poster: "Jane Doe", description: "This is my description and such. I don't think this is good for our streets, could someone help please!", date: "2024-12-11", emoji: "📍", lat: 51.5076, lng: -0.1280 }, // London (another spot)

  ];

  const ukBounds = [
    [49.5, -8],  // Southwest coordinates (approx.)
    [60, 2],     // Northeast coordinates (approx.)
  ];
  function NewReport() {
    const [position, setPosition] = useState(null);
  
    const map = useMapEvents({
      click(e) {
        // Log the map event location
        console.log("Map clicked at:", e.latlng);
  
        // Log the new report
        console.log("New report created at:", e.latlng);
        
        // Optionally, you can also update the position
        setPosition(e.latlng);
        
        // Fly to the clicked location
        map.flyTo(e.latlng, map.getZoom());
      },
      locationfound(e) {
        // Set the position when location is found
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });
  
    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    );
  }
  

  return (
      <MapContainer
        center={mapCenter}
        zoom={zoomLevel}
        style={{ width: "100%", minHeight:"100%", height: "100%" }}
        maxBounds={ukBounds} // Restrict map movement to UK
        maxBoundsViscosity={1.0} // Ensures map stays within bounds
        minZoom={8} // Set minimum zoom level to allow zooming in further
        maxZoom={15} // Set maximum zoom level to zoom in further
     >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {data.map((item) => (
          <Marker
            key={item.id}
            position={[item.lat, item.lng]}
            icon={new L.DivIcon({
              className: 'emoji-icon',
              html: `<span style="font-size: 30px;">${item.emoji}</span>`, // Using emoji as the icon
            })}
            eventHandlers={{
              click: () => {
                console.log("Marker clicked:", item); // Log the data of the clicked marker
                onMarkerSelected(item);
              }
            }}
          >
            <Popup>{item.name}</Popup>
          </Marker>
        ))}
        <NewReport />

      </MapContainer>
  );
};

export default MapComponent;
