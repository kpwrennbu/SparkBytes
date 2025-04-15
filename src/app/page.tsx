"use client";
import { useState, useEffect } from "react";
import { Alert, Flex, Input, Select } from "antd";
import supabase from "./api/supabaseClient";
import FoodCard from "./components/FoodCard";
import CreateEvent from "./components/CreateEvent";
import { EventRow } from "@/types";
import styles from "./page.module.css";

const { Option } = Select;

// Helper function: calculate distance using the Haversine formula (in kilometers)
function calculateDistance(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): number {
  const R = 6371; // Radius of the Earth in kilometers
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
  // Two sort criteria: "time" and "distance"
  const [sortBy, setSortBy] = useState("time");
  // Sort order: "asc" for ascending, "desc" for descending
  const [sortOrder, setSortOrder] = useState("asc");
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // State to store the user's current coordinates
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Ask for the user's location when the component mounts
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
    } else {
      console.error("Geolocation is not supported by your browser.");
    }
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from("Events").select("*");
      if (error) {
        console.error("Error fetching events:", error.message);
        setFetchError(error.message);
      } else {
        console.log("Got events:", data);
        setEvents(data as EventRow[]);
        setFetchError(null);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  // Validate the search input from user
  const isValidSearchTerm = (term: string) => /^[a-zA-Z0-9\s]*$/.test(term);

  // 1) Filter events based on the search term
  const filteredData = events.filter((event) =>
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2) Create a copy of the filtered events for sorting
  const sortedData = [...filteredData];

  // 3) Sort the data according to the chosen field & order
  if (sortBy === "time") {
    // Sorting by time_start (as an ISO string)
    sortedData.sort((a, b) => {
      const dateA = new Date(a.time_start).getTime();
      const dateB = new Date(b.time_start).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  } else if (sortBy === "distance") {
    // Sorting by distance (requires the user's location and event coordinates)
    if (userLocation) {
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
  }

  // 4) Render content based on the filtered/sorted data
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
      <Flex justify="space-around" align="center" wrap="wrap">
        {sortedData.map((event) => (
          <FoodCard key={event.id} {...event} />
        ))}
      </Flex>
    );
  }

  return (
    <div className={styles.page}>
      <div>
        <h1>Welcome to the Home Page</h1>
        <CreateEvent />
      </div>

      {fetchError && (
        <Alert
          message="Error fetching events"
          description={fetchError}
          type="error"
          showIcon
          closable
          style={{ margin: "20px" }}
        />
      )}

      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <Input
          placeholder="Search by location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        />
      </div>

      {/* Sorting controls: Time + Distance  */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingRight: "40px",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <label htmlFor="sortSelect" style={{ fontWeight: 500, whiteSpace: "nowrap" }}>
          Sort by:
        </label>
        <Select
          id="sortSelect"
          value={sortBy}
          onChange={(value) => setSortBy(value)}
          style={{ padding: "8px", borderRadius: "6px", fontSize: "16px", width: 150 }}
        >
          <Option value="time">Time</Option>
          <Option value="distance">Distance</Option>
        </Select>
        <label htmlFor="orderSelect" style={{ fontWeight: 500, whiteSpace: "nowrap" }}>
          Order:
        </label>
        <Select
          id="orderSelect"
          value={sortOrder}
          onChange={(value) => setSortOrder(value)}
          style={{ padding: "8px", borderRadius: "6px", fontSize: "16px", width: 150 }}
        >
          <Option value="asc">Ascending</Option>
          <Option value="desc">Descending</Option>
        </Select>
      </div>

      <div style={{ padding: "20px" }}>{content}</div>
    </div>
  );
}