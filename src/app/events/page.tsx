"use client";
import { useState, useEffect } from "react";
import { Alert, Flex, Input, Select, Typography } from "antd";
import supabase from "../api/supabaseClient";
import FoodCard from "../components/FoodCard";
import CreateEvent from "../components/CreateEvent";
import { EventRow } from "@/types";


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
    justifyContent: "center",
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
      <Typography.Text
        level={1}
        style={{
          fontWeight: "bold",
          fontSize: "3.5rem",
          lineHeight: "1.2",
          marginBottom: "0.0em",
        }}
      >
        FIND SOME FOOD!<br />
      </Typography.Text>
        <div style={styles.controlBar}>
          <Input
            placeholder="Search by location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <div style={styles.header}>
          <CreateEvent />
           </div>
  
          <div style={styles.sortControls}>
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
                fontSize: "16px",
              }}
            >
              <Option value="time">Time</Option>
              <Option value="distance">Distance</Option>
            </Select>
          </div>
        </div>
  
        <div style={{ padding: "5px" }}>
          <Flex justify="space-around" align="center" wrap="wrap">
            {filteredData.map((event, index) => (
              <FoodCard {...event} key={index} />
            ))}
          </Flex>
        </div>
      </div>
    </>
  );



};