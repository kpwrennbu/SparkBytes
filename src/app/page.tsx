"use client";
import { useState, useEffect } from "react";
import { Alert, Flex, Input, Select } from "antd";
import supabase from "./api/supabaseClient";
import FoodCard from "./components/FoodCard";
import CreateEvent from "./components/CreateEvent";
import { EventRow } from "@/types";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
const customIcon = L.icon({
  iconUrl: "/marker.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});
import Image from "next/image";

import MissionStatement from "./components/MissionStatement";


const { Option } = Select;

const styles = {
  page: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px 16px",
    fontFamily: "Segoe UI, sans-serif",
    display: 'flex', 
    justifyContent: "space-around", 
    alignItems: "start",
    gap: "5em"
  },
};
export default function Home() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching user location:", error);
        }
      );
    }
  }, []);

  return (
    <>
      <div style={styles.page}>
  
        <MissionStatement />
  
        <div style={{ height: "500px", width: "100%", marginTop: "2em" }}>
          <MapContainer
            center={[42.35, -71.1]}
            zoom={15}
            scrollWheelZoom={true}
            zoomControl={true}
            style={{ height: "500px", width: "100%", marginBottom: "1rem" }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
            />
            {[
              { lat: 42.3507, lng: -71.1088, label: "GSU - George Sherman Union" },
              { lat: 42.3495, lng: -71.1000, label: "Questrom Business School" },
              { lat: 42.3500, lng: -71.1033, label: "CDS - Center for Computing & Data Sciences" },
              { lat: 42.3493, lng: -71.1038, label: "Warren Towers Dorm" },
            ].map((loc, index) => (
              <Marker key={index} position={[loc.lat, loc.lng]} icon={customIcon}>
                <Popup>{loc.label}</Popup>
              </Marker>
            ))}
          </MapContainer>
          <p style={{ textAlign: "center", marginTop: "12px", fontWeight: "500", fontSize: "16px" }}>
            Our Most Common Event Locations
          </p>
        </div>
      </div>
      <div style={{ marginTop: "2em", marginBottom: "2em", textAlign: "center" }}>
        <div
          style={{
            borderTop: "2px solid #67b3ad",
            borderBottom: "2px solid #67b3ad",
            padding: "12px 0",
            margin: "0 auto",
            width: "90%",
          }}
        >
          <p style={{ margin: 0, fontSize: "16px", fontWeight: 500, fontFamily: "Segoe UI, sans-serif" }}>
            Please Contact One of Us with the Emails Above If You Wish to Post Your Own Events.
          </p>
        </div>
      </div>
    </>
  );

};