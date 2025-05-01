"use client";
import { useEffect, useState } from "react";
import { Flex, Spin, Typography, Empty } from "antd";
import supabase from "../api/supabaseClient";
import OrderCard from "../components/OrderCard";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const deleteOrder = async (id: number) => {
    const { error } = await supabase.from("Orders").delete().eq("id", id);
    if (error) {
      console.error(`Error deleting order with id ${id}:`, error);
    } else {
      console.log(`Successfully deleted order with id ${id}`);
    }
    fetchOrders();
  };

  const cancelOrder = async (orderId: number, foodId: number) => {
    const { error: deleteError } = await supabase
      .from("Orders")
      .delete()
      .eq("id", orderId);

    if (deleteError) {
      console.error("Error deleting order:", deleteError);
      return;
    }

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
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("❌ Failed to get current user:", authError);
      setOrders([]);
      setLoading(false);
      return;
    }

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
      `)
      .eq("grabber_id", user.id);

    if (error) {
      console.error("Error fetching orders:", error.message);
    } else {
      setOrders(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Flex align="center" justify="center" style={{ height: "100vh" }}>
        <Spin size="large" />
      </Flex>
    );
  }

  return orders.length > 0 ? (
    <Flex wrap="wrap" gap="large" justify="center" style={{ padding: "40px 24px" }}>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} deleteOrder={deleteOrder} cancelOrder={cancelOrder} />
      ))}
    </Flex>
  ) : (
    <Flex align="center" justify="center" style={{ height: "80vh", flexDirection: "column" }}>
      <Empty description={
        <Typography.Text type="secondary" style={{ fontSize: "16px" }}>
          No orders found. Please sign in and place an order to view it here.
        </Typography.Text>
      } />
    </Flex>
  );
}