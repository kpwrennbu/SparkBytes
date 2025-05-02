"use client";

import { useState, useEffect } from "react"; //react hooks
import { Flex, Input, Typography, Badge, Button, List, Dropdown } from "antd"; //antd UI
import supabase from "../api/supabaseClient"; //supabase imports

//imports from custom components
import FoodCard from "../components/FoodCard";
import CreateEvent from "../components/CreateEvent";
//types import
import { EventRow, SupabaseUserProfile } from "@/types";
import { styles } from "../utils/events.utils";
import { useNotifications } from "../components/NotificationProvider";
import {
  BellOutlined
} from "@ant-design/icons";
//needs fixing
export default function Events() {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState<EventRow[]>([]);
  const [fullUser, setFullUser] = useState<SupabaseUserProfile>();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  useEffect(() => {
    const fetchUserDetails = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("Failed to get auth user:", authError);
        return;
      }

      const { data, error: profileError } = await supabase
        .from("userinfo")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Error fetching user profile:", profileError);
      } else {
        setFullUser(data);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      const now = new Date().toISOString();
      const { data: eventsData, error: eventsError } = await supabase
        .from("Events")
        .select("*")
        .gt("time_end", now);

      if (eventsError) {
        console.error("Error fetching events:", eventsError.message);
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
    };

    fetchEvents();
  }, []);

  const filteredData = events.filter(
    (event) =>
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const notificationMenu = (
    <div style={{ width: 300 }}>
      <List
        size="small"
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item
            style={{ background: item.read ? "#fff" : "#e6f7ff", cursor: "pointer" }}
            onClick={() => markAsRead(item.id)}
          >
            <List.Item.Meta
              title={item.payload.title}
              description={new Date(item.created_at).toLocaleString()}
            />
          </List.Item>
        )}
      />
      {unreadCount > 0 && (
        <div style={{ textAlign: "center", padding: 8 }}>
          <Button size="small" onClick={() => notifications.filter((n) => !n.read).forEach((n) => markAsRead(n.id))}>
            Mark all as read
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <Typography.Text style={styles.sectionTitle}>
          Find an Event!
        </Typography.Text>
      </div>

      <div style={styles.controlBar}>
        <Input
          placeholder="Search by location and event..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        <div style={{ display: "flex", gap: "16px" }}>
          {(fullUser?.is_coordinator === 1  || true)&& <CreateEvent />} 
          <Dropdown overlay={notificationMenu} trigger={["click"]} placement="bottomRight">
            <Badge count={unreadCount} offset={[-4, 4]}>
              <Button type="text" icon={<BellOutlined style={{ fontSize: 18 }} />} />
            </Badge>
          </Dropdown>
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
  );
}
