"use client";

import { useEffect, useState } from "react";
import { Card, Flex, Spin, Typography } from "antd";
import supabase from "../api/supabaseClient";
import OrderCard from "../components/OrderCard";

export default function ContactsPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const deleteOrder = async (id: number) => {
    const { error } = await supabase
      .from("Orders")
      .delete()
      .eq("id", id);
  
    if (error) {
      console.error(`Error deleting order with id ${id}:`, error);
    } else {
      console.log(`Successfully deleted order with id ${id}`);
    }
    fetchOrders();
  };
  
  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("Orders")
      .select(`
        id,
        student_id,
        food:food_id (
          id,
          name,
          calories,
          carbs,
          proteins,
          fats,
          quantity_left,
          total_quantity,
          allergies,
          serving_size_unit,
          event_id,
          event:event_id (
            name, 
            location
          )
        )
      `);

    if (error) {
      console.error("Error fetching orders:", error.message);
    } else {
      setOrders(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    console.log("orders: ", orders)
  }, []);
  if (loading) {
    return (
      <Flex align="center" justify="center" style={{ height: "100vh" }}>
        <Spin size="large" />
      </Flex>
    );
  }
  console.log("orders are:", orders)
  return (
    <Flex wrap="wrap" gap="large" justify="center">
      {orders.map((order) => (
        <OrderCard order={order} deleteOrder={deleteOrder} />
      ))}
    </Flex>
  );
}
