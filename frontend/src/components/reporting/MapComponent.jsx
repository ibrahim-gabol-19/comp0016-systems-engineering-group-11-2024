import React, { useState, useContext, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { CompanyContext } from "../../context/CompanyContext";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 16],
});

// Selected Icon (Larger)
let SelectedIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [35, 57], // Increased size
  iconAnchor: [17, 57], // Adjusted anchor
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = ({
  onMarkerSelected,
  onNewMarkerSelected,
  reports,
  newMarker,
  activeFilters,
  selectedMarker,
  mapRef,
  viewingAISummary,
  isSidebarOpen,
}) => {
  const zoomLevel = 13;
  const { sw_lat, sw_lon, ne_lat, ne_lon } = useContext(CompanyContext);
  const [position, setPosition] = useState(null);

  const bounds = [
    [sw_lat, sw_lon],
    [ne_lat, ne_lon],
  ];

  function RecenterMap({ selectedMarker }) {
    const map = useMap();

    useEffect(() => {
      if (viewingAISummary) {
        return;
      }
      if (
        selectedMarker &&
        selectedMarker.latitude !== undefined &&
        selectedMarker.longitude !== undefined
      ) {
        map.flyTo(
          [selectedMarker.latitude, selectedMarker.longitude],
          map.getZoom()
        );
      }
      if (newMarker && newMarker.latlng) {
        map.flyTo(newMarker.latlng, map.getZoom());
      }
      // eslint-disable-next-line
    }, [selectedMarker, newMarker, map]);

    return null;
  }

  function RecenterMapNoMarker({isSidebarOpen}) {
    const map = useMap();

    useEffect(() => {
      if (viewingAISummary) {
        return;
      }
      if (!isSidebarOpen) {
        map.flyTo(
          [
            (parseFloat(sw_lat) + parseFloat(ne_lat)) / 2, // Midpoint latitude
            (parseFloat(sw_lon) + parseFloat(ne_lon)) / 2, // Midpoint longitude
          ],
          map.getZoom()
        );
      }
      // eslint-disable-next-line
    }, [isSidebarOpen]);

    return null;
  }

  function NewReport() {
    const map = useMapEvents({
      click(e) {
        map.closePopup();
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
        onNewMarkerSelected(e);
      },
      locationfound(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return newMarker === null ? null : (
      <Marker
        position={position || newMarker.latlng}
        draggable={true}
        icon={SelectedIcon}
      ></Marker>
    );
  }

  const filteredReports = reports.filter((item) =>
    activeFilters.includes(item.status)
  );

  return (
    <div
      style={{ position: "relative", width: "100%", height: "100%", zIndex: 0 }}
    >
      <MapContainer
        center={[
          (parseFloat(sw_lat) + parseFloat(ne_lat)) / 2, // Midpoint latitude
          (parseFloat(sw_lon) + parseFloat(ne_lon)) / 2, // Midpoint longitude
        ]}
        zoom={zoomLevel}
        style={{ width: "100%", minHeight: "100%", height: "100%" }}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        minZoom={8}
        maxZoom={17}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {filteredReports.map((item) => (
          <Marker
            key={item.id}
            position={[item.latitude, item.longitude]}
            icon={
              selectedMarker && selectedMarker.id === item.id
                ? SelectedIcon
                : DefaultIcon
            }
            eventHandlers={{
              click: () => {
                onMarkerSelected(item);
              },
            }}
          />
        ))}
        <NewReport />
        <RecenterMap selectedMarker={selectedMarker} />
        <RecenterMapNoMarker isSidebarOpen={isSidebarOpen}/>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
