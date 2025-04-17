"use client";
import styles from "./page.module.css";
import FoodCard from "./components/FoodCard";
import { Flex, Alert, Input, Select } from "antd";
import { useState } from "react";
import CreateEvent from "./components/CreateEvent";
import supabase from "./api/supabaseClient";
import { useEffect } from "react";
import { EventRow } from "@/types";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const { Option } = Select;

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("time");
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('Events')
        .select('*');

      if (error) {
        console.error('Error fetching events:', error.message);
      } else {
        console.log("got events, they are: ", data)
        setEvents(data);
      }

      setLoading(false);
    };
    fetchEvents();
  }, []);

  const filteredData = events.filter((event) =>
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <>
      <div className={styles.page}>
        <div>
          <h1>Welcome to the Home Page</h1>
          <CreateEvent /> 
        </div>

        <div style={{ marginBottom: "8px", textAlign: "center" }}>
          <input
            type="text"
            placeholder="Search by location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "10px",
              width: "300px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px"
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingRight: "40px",
            gap: "10px",
            marginBottom: "8px"
          }}
        >
          <label htmlFor="sortSelect" style={{ fontWeight: 500, whiteSpace: "nowrap" }}>
            Sort by:
          </label>
          <Select
            id="sortSelect"
            value={sortBy}
            onChange={(value) => setSortBy(value)}
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "16px"
            }}
          >
            <Option value="time">Time</Option>
            <Option value="distance">Distance</Option>
          </Select>
        </div>

        <div style={{ padding: "5px" }}>
          <Flex justify="space-around" align="center" wrap="wrap">
            {filteredData.map((event, index) => (
              <FoodCard {...event} key={index} />
            ))}
          </Flex>
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
}
