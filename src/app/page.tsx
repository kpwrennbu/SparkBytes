"use client";
import styles from "./page.module.css";
import FoodCard from "./components/FoodCard";
import { Flex } from "antd";
import { useState } from "react";
import CreateEvent from "./components/CreateEvent";
import supabase from "./api/supabaseClient";
import { useEffect } from "react";
import { EventRow } from "@/types";
import { Alert } from "antd";
export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("time");
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  // const data = [
  //   {
  //     location: "Warren Towers",
  //     description: "Freshmen CGS Orientation",
  //     time: "Thursday, May 4th, 12PM", 
  //     img: "/WarrenTowers.jpg", 
  //     food: [
  //       { 
  //       key: 1,
  //       food: "BLT",
  //       quantity: 2,
  //       calories: 540,
  //       protein: 15,
  //       fat: 20,
  //       carbs: 5,
  //       allergies: ["Gluten", "Tree Nut"]
  //     }, 
  //     {
  //       key: 2, 
  //       food: "Fortnite Sandwich",
  //       quantity: 5,
  //       calories: 540,
  //       protein: 15,
  //       fat: 20,
  //       carbs: 5,
  //       allergies: ["Gluten", "Tree Nut"]
  //     }
  //     ]
  //   },
  //   {
  //     location: "CDS",
  //     description: "Freshmen CGS Orientation",
  //     time: "Thursday, May 4th, 12PM",
  //     img: "/CDS.jpg", 
  //     food: [
  //       { 
  //       key: 1,
  //       food: "BLT",
  //       quantity: 2,
  //       calories: 540,
  //       protein: 15,
  //       fat: 20,
  //       carbs: 5,
  //       allergies: ["Gluten", "Tree Nut"]
  //     }, 
  //     {
  //       key: 2, 
  //       food: "Fortnite Sandwich",
  //       quantity: 5,
  //       calories: 540,
  //       protein: 15,
  //       fat: 20,
  //       carbs: 5,
  //       allergies: ["Gluten", "Tree Nut"]
  //     }
  //     ]
  //   },
  //   {
  //     location: "GSU",
  //     description: "Freshmen CGS Orientation",
  //     time: "Thursday, May 4th, 12PM",
  //     img: "/GSU.jpeg", 
  //     food: [
  //       { 
  //       key: 1,
  //       food: "BLT",
  //       quantity: 2,
  //       calories: 540,
  //       protein: 15,
  //       fat: 20,
  //       carbs: 5,
  //       allergies: ["Gluten", "Tree Nut"]
  //     }, 
  //     {
  //       key: 2, 
  //       food: "Fortnite Sandwich",
  //       quantity: 5,
  //       calories: 540,
  //       protein: 15,
  //       fat: 20,
  //       carbs: 5,
  //       allergies: ["Gluten", "Tree Nut"]
  //     }
  //     ]
  //   },
  // ];
 
  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from("Events").select("*");

      if (error) {
        console.error("Error fetching events:", error.message);
      } else {
        console.log("got events, they are: ", data);
        setEvents(data);
      }

      setLoading(false);
    };
    fetchEvents();
  }, []);

  const isValidSearchTerm = (term: string) => {
    return /^[a-zA-Z0-9\s]*$/.test(term);
  };

  const filteredData = events.filter((event) =>
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
  } else if (searchTerm !== "" && filteredData.length === 0) {
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
        {filteredData.map((event, index) => (
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

      <div style={{ marginBottom: "20px", textAlign: "center" }}>
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
        <select
          id="sortSelect"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        >
          <option value="time">Time</option>
          <option value="distance">Distance</option>
        </select>
      </div>

      <div style={{ padding: "20px" }}>
        {content}
      </div>
    </div>
  );
}