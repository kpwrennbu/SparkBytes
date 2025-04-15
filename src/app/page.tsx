"use client";
import { useState, useEffect } from "react";
import { Alert, Flex, Input, Select } from "antd";
import supabase from "./api/supabaseClient";
import FoodCard from "./components/FoodCard";
import CreateEvent from "./components/CreateEvent";
import { EventRow } from "@/types";
import styles from "./page.module.css";

const { Option } = Select;

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("time"); // Field to sort by: "time" or "distance"
  const [sortOrder, setSortOrder] = useState("asc"); // Order: "asc" (ascending) or "desc" (descending)
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from("Events").select("*");

      if (error) {
        console.error("Error fetching events:", error.message);
        setFetchError(error.message);
      } else {
        console.log("Got events:", data);
        setEvents(data);
        setFetchError(null);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const isValidSearchTerm = (term: string) => /^[a-zA-Z0-9\s]*$/.test(term);

  // 1) Filter events based on search term
  const filteredData = events.filter((event) =>
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2) Create a copy of filtered events for sorting
  const sortedData = [...filteredData];

  // 3) Sort the data according to 'sortBy' and 'sortOrder'
  if (sortBy === "time") {
    // Sort by time_start (assumed to be in ISO format)
    sortedData.sort((a, b) => {
      const dateA = new Date(a.time_start).getTime();
      const dateB = new Date(b.time_start).getTime();
      // For ascending order, subtract dateA - dateB; for descending, swap
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  } else if (sortBy === "distance") {
    // Uncomment and update if you have a distance field in your event data
    // sortedData.sort((a, b) => {
    //   return sortOrder === "asc" ? a.distance - b.distance : b.distance - a.distance;
    // });
  }

  // 4) Conditionally render content
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
        {sortedData.map((event, index) => (
          <FoodCard {...event} key={index} />
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