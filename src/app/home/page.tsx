"use client";
import { useState, useEffect } from "react";
import { Alert, Flex, Input, Select } from "antd";
import { EventRow } from "@/types";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Image from "next/image";

import MissionStatement from "../components/MissionStatement";


const { Option } = Select;

const styles = {
  page: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px 16px",
    fontFamily: "Segoe UI, sans-serif",
    display: "flex", 
    justifyItems: "space-around"
  },
  header: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    marginBottom: "32px",
  },
  controlBar: {
    display: "flex",
    flexWrap: "wrap" as const,
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "24px",
    padding: "0 12px",
  },
  sortControls: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap" as const,
  },
  searchInput: {
    padding: "10px",
    borderRadius: "8px",
    fontSize: "16px",
    width: "300px",
    flex: "1 0 250px",
  },


};


export default function Home() {
//   const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setUserLocation({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           });
//         },
//         (error) => {
//           console.error("Error fetching user location:", error);
//         }
//       );
//     }
//   }, []);

  return (
    <>
      <div style={styles.page}>
   
        <div>
          <MissionStatement /> 
        </div>
        <div style={{ height: "500px", width: "100%", marginTop: "2em" }}>
          <MapContainer
            center={[42.35, -71.1]} // Boston
            zoom={13}
            scrollWheelZoom={true}
            zoomControl={true}
            style={{ height: "500px", width: "100%", marginBottom: "1rem" }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
            />
            <Marker position={[42.35, -71.1]}>
              <Popup>Boston marker</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </>
  );



};