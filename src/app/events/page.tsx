"use client";
import { useState, useEffect } from "react"; //react hooks
import {Flex, Input, Select } from "antd"; //antd UI
import supabase from "../api/supabaseClient"; //supabase imports

//imports from custom components
import FoodCard from "../components/FoodCard";
import CreateEvent from "../components/CreateEvent";
//types import
import { EventRow, SupabaseUserProfile } from "@/types";
import { styles } from "../utils/events.utils";


const { Option } = Select;

export default function Events() {

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("time");
  const [events, setEvents] = useState<EventRow[]>([]);
  const [fullUser, setFullUser] = useState<SupabaseUserProfile>();

  useEffect(() => {
    const fetchUserDetails = async () => {
      // Step 1: Get currently logged-in user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("Failed to get auth user:", authError);
        return;
      }

      // Step 2: Query your Users table by the user's auth ID (uuid)
      const { data, error: profileError } = await supabase
        .from("userinfo")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Error fetching user profile:", profileError);
      } else {
        console.log("data: ", data)
        setFullUser(data);
      }
    };

    fetchUserDetails();
  }, []);
  


  useEffect(() => {
    const fetchEvents = async () => {
      const now = new Date().toISOString(); // current UTC time
  
      const { data: eventsData, error: eventsError } = await supabase
        .from("Events")
        .select("*")
        .gt("time_end", now); // filter out expired events
  
      if (eventsError) {
        console.error("Error fetching events:", eventsError.message);
        return;
      }
  
      const filteredEvents: EventRow[] = [];
  
      //filter events that actually have quantity left
      for (const event of eventsData) {
        const { data: foodItems, error: foodError } = await supabase
          .from("Food")
          .select("id")
          .eq("event_id", event.id)
          .gt("quantity_left", 0);
  
        if (foodError) {
          console.error(`Error checking food for event ${event.id}:`, foodError.message);
          continue;
        }
  
        if (foodItems.length > 0) {
          filteredEvents.push(event);
        }
      }
  
      setEvents(filteredEvents);
    };
  
    fetchEvents();
  }, []);
  
  


  const filteredData = events.filter((event) =>
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <>
      <div style={styles.page}>
        <div style={styles.header}>
        {fullUser?.is_coordinator && ( 
           <CreateEvent />
        )}
        
        </div>
    
        <div style={styles.controlBar}>
          <Input
            placeholder="Search by location and event..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
  
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
