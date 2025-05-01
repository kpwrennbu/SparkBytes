"use client";

import { useState, useEffect } from "react";
import { MapContainer as LeafletMap, TileLayer as LeafletTileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { Card, Button } from "antd";
// import "leaflet/dist/leaflet.css";

// Fix missing marker icons in Next.js
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

type MarkerData = {
  id: number;
  lat: number;
  lng: number;
  foodTitle: string;
  description: string;
};

function LocationMarker({ onAdd }: { onAdd: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onAdd(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function InteractiveMap() {
  const [markers, setMarkers] = useState<MarkerData[]>([]);

    // dynamically load Leaflet CSS on the client only
    useEffect(() => {
      // @ts-expect-error importing CSS at runtime
      import("leaflet/dist/leaflet.css");
    }, []);

  const handleAddMarker = (lat: number, lng: number) => {
    const newMarker: MarkerData = {
      id: Date.now(),
      lat,
      lng,
      foodTitle: "Overbought Food",
      description: "Free food from student org!",
    };
    setMarkers((prev) => [...prev, newMarker]);
  };

  return (
    <LeafletMap center={[42.35, -71.1]} zoom={14} style={{
      height: "600px",
      width: "calc(100vw - 40px)",
      margin: "2rem auto",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}>
        <LeafletTileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
        />
      <LocationMarker onAdd={handleAddMarker} />
      {markers.map((marker) => (
        <Marker key={marker.id} position={[marker.lat, marker.lng]}>
          <Popup>
            <Card title={marker.foodTitle} style={{ width: 250 }}>
              <p>{marker.description}</p>
              <Button type="primary">View Options</Button>
            </Card>
          </Popup>
        </Marker>
      ))}
    </LeafletMap>
  );
}