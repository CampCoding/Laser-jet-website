"use client";

import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapEffect({ lat, lng }) {
  const map = useMap();

  useEffect(() => {
    if (lat != null && lng != null) {
      // 👇 هنا التكبير (Zoom) لما الإحداثيات تتغير
      map.setView([lat, lng], 16, { animate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);

  return null;
}

function LocationHandler({ setLatitude, setLongitude }) {
  useMapEvents({
    click(e) {
      // مجرد تحديث الإحداثيات
      setLatitude(e.latlng.lat);
      setLongitude(e.latlng.lng);
      // MapEffect هو اللي هيتكفل بالزوم والتحريك
    },
  });
  return null;
}

export default function MapSelector({
  latitude,
  longitude,
  setLatitude,
  setLongitude,
}) {
  const center = [latitude ?? 30.0444, longitude ?? 31.2357]; // افتراضي القاهرة

  return (
    <MapContainer
      center={center}
      zoom={latitude && longitude ? 12 : 6} // زوم عام أول ما تفتح
      style={{ height: "100%", width: "100%", borderRadius: 8 }}
      scrollWheelZoom={true}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* يتحرك ويعمل زوم عند تغيير الإحداثيات */}
      <MapEffect lat={latitude} lng={longitude} />

      {/* يلتقط كليك المستخدم ويحدّث الإحداثيات */}
      <LocationHandler setLatitude={setLatitude} setLongitude={setLongitude} />

      {latitude != null && longitude != null && (
        <Marker position={[latitude, longitude]} icon={markerIcon} />
      )}
    </MapContainer>
  );
}
