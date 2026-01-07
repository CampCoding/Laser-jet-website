import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker issue in Leaflet
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

const customMarker = new L.Icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const MyMap = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <MapContainer
      center={[40, -100]} // Initial coordinates
      zoom={4}
      style={{ width: "100%", height: "500px" }}
      whenCreated={(map) => setTimeout(() => map.invalidateSize(), 500)} // Fix map rendering issues
    >
      {/* Map Tiles */}
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Marker Example */}
      <Marker
        position={[40, -100]}
        icon={customMarker}
        eventHandlers={{
          click: () => setSelectedLocation([40, -100]),
        }}
      >
        {selectedLocation && (
          <Popup
            position={selectedLocation}
            eventHandlers={{
              close: () => setSelectedLocation(null),
            }}
          >
            <div>Selected Location</div>
          </Popup>
        )}
      </Marker>
    </MapContainer>
  );
};

export default MyMap;
