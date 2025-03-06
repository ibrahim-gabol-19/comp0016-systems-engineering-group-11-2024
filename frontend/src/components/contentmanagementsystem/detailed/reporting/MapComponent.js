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
import { CompanyContext } from "../../../../context/CompanyContext";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 16],
});

let SelectedIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [35, 57],
  iconAnchor: [17, 57],
});

const searchFilterItems = (
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

L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = ({
  onMarkerSelected,
  onNewMarkerSelected,
  reports,
  newMarker,
  activeFilters,
  selectedMarker,
  mapRef,
  userQuery,
}) => {
  const zoomLevel = 13;
  const [position, setPosition] = useState(null);
  const { sw_lat, sw_lon, ne_lat, ne_lon } = useContext(CompanyContext);

  const bounds = [
    [sw_lat, sw_lon],
    [ne_lat, ne_lon],
  ];

  function RecenterMap({ selectedMarker }) {
    const map = useMap();

    useEffect(() => {
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
    }, [selectedMarker, map]);

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
      <Marker position={position} draggable={true} icon={SelectedIcon}></Marker>
    );
  }

  // Combine filters
  const statusFilteredReports = reports.filter((item) =>
    activeFilters.includes(item.status)
  );
  const combinedFilteredReports = searchFilterItems(
    statusFilteredReports,
    userQuery
  );

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", zIndex: 10 }}>
      <MapContainer
        center={[0, 0]}
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
        {combinedFilteredReports.map((item) => (
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
      </MapContainer>
    </div>
  );
};

export default MapComponent;