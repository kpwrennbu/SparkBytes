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
  const cancelOrder = async (orderId: number, foodId: number) => {
    // 1. Delete the order
    const { error: deleteError } = await supabase
      .from("Orders")
      .delete()
      .eq("id", orderId);
  
    if (deleteError) {
      console.error("Error deleting order:", deleteError);
      return;
    }
  
    // 2. Get current quantity_left
    const { data, error: fetchError } = await supabase
      .from("Food")
      .select("quantity_left")
      .eq("id", foodId)
      .single();
  
    if (fetchError) {
      console.error("Error fetching food:", fetchError);
      return;
    }
  
    const updatedQuantity = data.quantity_left + 1;
  
    // 3. Update the quantity_left
    const { error: updateError } = await supabase
      .from("Food")
      .update({ quantity_left: updatedQuantity })
      .eq("id", foodId);
  
    if (updateError) {
      console.error("Error updating food quantity:", updateError);
    } else {
      console.log(`Successfully incremented quantity_left to ${updatedQuantity}`);
    }
    fetchOrders();
  };
  
  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("Orders")
      .select(`
        id,
        grabber_id,
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
            location, 
            time_end
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
        <OrderCard key={order.id} order={order} deleteOrder={deleteOrder} cancelOrder={cancelOrder} />
      ))}
    </Flex>
  );
}