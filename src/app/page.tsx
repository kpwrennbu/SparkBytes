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
              { lat: 42.3500, lng: -71.1033, label: "CDS - Center for Computing & Data Sciences" },
              { lat: 42.3493, lng: -71.1038, label: "Warren Towers Dorm" },
            ].map((loc, index) => (
              <Marker key={index} position={[loc.lat, loc.lng]} icon={customIcon}>
                <Popup>{loc.label}</Popup>
              </Marker>
            ))}
          </MapContainer>
          <p style={{ textAlign: "center", marginTop: "12px", fontWeight: "500", fontSize: "16px" }}>
            <strong> Our Most Common Event Locations </strong>
          </p>
        </div>
      </div>
            <div style={{ marginTop: "4em", marginBottom: "4em", display: "flex", flexDirection: "column", gap: "4em", alignItems: "center" }}>
        {/* 1st Section: Photo Left, Text Right */}
        <div style={{ display: "flex", alignItems: "center", gap: "3em", maxWidth: "1000px" }}>
          <img src="Rhett_Photos/Rhett_Food.png" alt="Rhett eating food" style={{ width: "300px", height: "auto", borderRadius: "10px" }} />
          <div style={{ flex: 1, textAlign: "center", maxWidth: "500px" }}>
            <h2 style={{ fontSize: "32px", marginBottom: "0.5em", fontFamily: "Georgia, serif" }}>Enjoy Delicious Surplus Meals</h2>
            <p style={{ fontSize: "20px", lineHeight: "1.8", fontFamily: "Georgia, serif" }}>
              SparkBytes connects you to fresh, delicious meals left over from BU events. Reduce waste and fill your plate by accessing food that would otherwise go unused.
            </p>
          </div>
        </div>

        {/* 2nd Section: Text Left, Photo Right */}
        <div style={{ display: "flex", alignItems: "center", gap: "3em", flexDirection: "row-reverse", maxWidth: "1000px" }}>
          <img src="Rhett_Photos/Rhett_Order.png" alt="Rhett placing an order" style={{ width: "300px", height: "auto", borderRadius: "10px" }} />
          <div style={{ flex: 1, textAlign: "center", maxWidth: "500px" }}>
            <h2 style={{ fontSize: "32px", marginBottom: "0.5em", fontFamily: "Georgia, serif" }}>Order Easily Through SparkBytes</h2>
            <p style={{ fontSize: "20px", lineHeight: "1.8", fontFamily: "Georgia, serif" }}>
              Browse available surplus food, set up your preferences, and place an order in seconds. Your next meal could be just a few clicks away with SparkBytes.
            </p>
          </div>
        </div>

        {/* 3rd Section: Photo Left, Text Right */}
        <div style={{ display: "flex", alignItems: "center", gap: "3em", maxWidth: "1000px" }}>
          <img src="Rhett_Photos/Rhett_Event.png" alt="Rhett at an event" style={{ width: "300px", height: "auto", borderRadius: "10px" }} />
          <div style={{ flex: 1, textAlign: "center", maxWidth: "500px" }}>
            <h2 style={{ fontSize: "32px", marginBottom: "0.5em", fontFamily: "Georgia, serif" }}>Add New Events and Share Food</h2>
            <p style={{ fontSize: "20px", lineHeight: "1.8", fontFamily: "Georgia, serif" }}>
              Hosting an event? SparkBytes lets you easily share extra food with the BU community, making a difference while keeping sustainability at the heart of our campus.
            </p>
          </div>
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
            Login to Set Up Your Food Preferences, Set Up Your Order, or Add Events!</p>
        </div>
      </div>
    </>
  );

};