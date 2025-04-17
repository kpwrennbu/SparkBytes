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
import Image from "next/image";

import MainUI from "./components/Main_UI";


const { Option } = Select;

const styles = {
  page: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px 16px",
    fontFamily: "Segoe UI, sans-serif",
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

function calculateDistance(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): number {
  const R = 6371;
  const dLat = ((destination.lat - origin.lat) * Math.PI) / 180;
  const dLng = ((destination.lng - origin.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((origin.lat * Math.PI) / 180) *
      Math.cos((destination.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}


export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("time");
  const [sortOrder, setSortOrder] = useState("asc");
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
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


  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from("Events").select("*");
      if (error) {
        console.error("Error fetching events:", error.message);
        setFetchError(error.message);
      } else {
        setEvents(data as EventRow[]);
        setFetchError(null);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);


  const isValidSearchTerm = (term: string) => /^[a-zA-Z0-9\s]*$/.test(term);

  const filteredData = events.filter((event) =>
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const sortedData = [...filteredData];

  if (sortBy === "time") {
    sortedData.sort((a, b) => {
      const dateA = new Date(a.time_start).getTime();
      const dateB = new Date(b.time_start).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  } else if (sortBy === "distance" && userLocation) {
    sortedData.sort((a, b) => {
      const distanceA = calculateDistance(userLocation, {
        lat: Number(a.latitude),
        lng: Number(a.longitude),
      });
      const distanceB = calculateDistance(userLocation, {
        lat: Number(b.latitude),
        lng: Number(b.longitude),
      });
      return sortOrder === "asc" ? distanceA - distanceB : distanceB - distanceA;
    });
  }

  let content;
  if (searchTerm !== "" && !isValidSearchTerm(searchTerm)) {
    content = (
      <Alert
        message="Invalid search input. Please enter valid characters."
        type="error"
        showIcon
        style={{ margin: "20px" }}
      />
    );
  } else if (searchTerm !== "" && sortedData.length === 0) {
    content = (
      <Alert
        message="No events found. Please try a different search term."
        type="error"
        showIcon
        style={{ margin: "20px" }}
      />
    );
  } else {
    content = (
      <div style={{
        display: "flex",
        flexDirection: "column"
      }}>
  {sortedData.map((event) => (
    <div key={event.id} >
      <FoodCard {...event} />
    </div>
  ))}
    </div>
    );
  }


  return (
    <>
      <div style={styles.page}>
        <div style={styles.header}>
          <Image src="/Spark.png" alt="SparkBytes Logo" width={350} height={200} />
          <CreateEvent />
        </div>
  
        <MainUI />
  
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