import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import leaflet styles

const MapComponent = ({ onMarkerSelected }) => {
  const [filteredItems, setFilteredItems] = useState([]);
  const [mapCenter, setMapCenter] = useState([51.5074, -0.1278]); // Default center of the UK (London)
  const [zoomLevel, setZoomLevel] = useState(6); // Default zoom level for the UK
  const [position, setPosition] = useState(null); // New marker position

  const data = [
    {
      id: 1,
      name: "Volunteering Event",
      type: "issues",
      date: "2024-12-15",
      emoji: "🙌",
      lat: 51.5074,
      lng: -0.1278,
      discussion: [
        "I think this is good!",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
      ],
    }, // London
    {
      id: 2,
      name: "News Update",
      type: "issues",
      date: "2024-12-10",
      emoji: "📰",
      lat: 53.4084,
      lng: -2.9916,
      discussion: [
        "I think this is good!",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
      ],
    }, // Manchester
    {
      id: 3,
      name: "Local Issue",
      type: "issues",
      date: "2024-12-14",
      emoji: "⚠️",
      lat: 52.4862,
      lng: -1.8904,
      discussion: [
        "I think this is good!",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
      ],
    }, // Birmingham
    {
      id: 4,
      name: "Community Event",
      type: "issues",
      date: "2024-12-12",
      emoji: "📍",
      lat: 51.4545,
      lng: -2.5879,
      discussion: [
        "I think this is good!",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
      ],
    }, // Bristol
    {
      id: 5,
      name: "Volunteering Event",
      type: "issues",
      date: "2024-12-13",
      emoji: "🙌",
      lat: 55.9533,
      lng: -3.1883,
      discussion: [
        "I think this is good!",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
      ],
    }, // Edinburgh
    {
      id: 6,
      name: "News Update",
      type: "issues",
      date: "2024-12-16",
      emoji: "📰",
      lat: 53.408,
      lng: -2.2389,
      discussion: [
        "I think this is good!",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
      ],
    }, // Liverpool
    {
      id: 7,
      name: "Local Issue",
      type: "issues",
      date: "2024-12-17",
      emoji: "⚠️",
      lat: 52.2053,
      lng: 0.1218,
      discussion: [
        "I think this is good!",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
      ],
    }, // Cambridge
    {
      id: 8,
      name: "Community pickup for Trafalgar Square (Green Earth)",
      type: "issues",
      status: "Open",
      tags: "Environmental",
      poster: "Jane Doe",
      description:
        "This is my description and such. I don't think this is good for our streets, could someone help please!",
      date: "2024-12-11",
      emoji: "📍",
      lat: 51.5076,
      lng: -0.128,
      discussion: [
        "I think this is good! What what what iahdwoiahwodihaoiwhdoiahwdoihawoidhaowidhoaihwdoaihwdoiahwdoihaowid ada adawda sdawsd wasdw asdw asd wasd wasd wasd wasd waasdw asdw asdhaowihdoaiwhdoiahwdohi",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
      ],
    }, // London (another spot)
  ];

  const ukBounds = [
    [49.5, -8], // Southwest coordinates (approx.)
    [60, 2], // Northeast coordinates (approx.)
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
        onMarkerSelected("new");
      },
      locationfound(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return position === null ? null : (
      <Marker
        position={position}
        draggable={true}
        icon={
          new L.DivIcon({
            className: "emoji-icon",
            html: `<span style="font-size: 40px;">🚩</span>`,
          })
        }
      >
        <Popup>You are here</Popup>
      </Marker>
    );
  }

  return (
    <MapContainer
      center={mapCenter}
      zoom={zoomLevel}
      style={{ width: "100%", minHeight: "100%", height: "100%" }}
      maxBounds={ukBounds} // Restrict map movement to UK
      maxBoundsViscosity={1.0} // Ensures map stays within bounds
      minZoom={8} // Set minimum zoom level to allow zooming in further
      maxZoom={17} // Set maximum zoom level to zoom in further
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {data.map((item) => (
        <Marker
          key={item.id}
          position={[item.lat, item.lng]}
          icon={
            new L.DivIcon({
              className: "emoji-icon",
              html: `<span style="font-size: 30px;">${item.emoji}</span>`,
            })
          }
          eventHandlers={{
            click: () => {
              console.log("Marker clicked:", item); // Log the data of the clicked marker
              onMarkerSelected(item);
            },
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
