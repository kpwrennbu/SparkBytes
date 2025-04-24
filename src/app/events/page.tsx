"use client";
import { useState, useEffect } from "react";
import { Alert, Button, Flex, Input, Select } from "antd";
import supabase from "../api/supabaseClient";
import FoodCard from "../components/FoodCard";
import CreateEvent from "../components/CreateEvent";
import { EventRow } from "@/types";
import "leaflet/dist/leaflet.css";



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
  const [fullUser, setFullUser] = useState<any>(null);

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
        .from("Users")
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
      const now = new Date().toISOString(); // current UTC time
  
      const { data: eventsData, error: eventsError } = await supabase
        .from("Events")
        .select("*")
        .gt("time_end", now); // filter out expired events
  
      if (eventsError) {
        console.error("Error fetching events:", eventsError.message);
        setFetchError(eventsError.message);
        setLoading(false);
        return;
      }
  
      const filteredEvents: EventRow[] = [];
  
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
      setFetchError(null);
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
        {(fullUser?.is_coordinator == 1) && ( 
           <CreateEvent />
        )}
        
        </div>
    
        <div style={styles.controlBar}>
          <Input
            placeholder="Search by location..."
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