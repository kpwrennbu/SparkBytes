"use client";
import { useEffect, useState } from "react";
import { Flex, Spin, Typography, Empty } from "antd";
import supabase from "../api/supabaseClient";
import OrderCard from "../components/OrderCard";
import type { Orders } from "@/types";
export default function OrdersPage() {
  const [orders, setOrders] = useState<Orders[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchOrders();
  }, []);

  // const handleOrders = async (food: FoodOrder, id: number, grabber_id: string) => {
  //   console.log("food in handleOrders", food);
  //  console.log("id", id);
  //  console.log("grabber_id", id)
  //  console.log("food.event: ", food.event)
  //   const { data } = await supabase
  //     .from("Events")
  //     .select("*")
  //     .eq("id", food.event_id)
  //     .single(); // or .limit(1) if you prefer
  
  //  const newData = {
  //     food,
  //     id, 
  //     grabber_id, 
  //     event_name: data.name, 
  //     event_location: data.location
  //   }
  //   setOrders(prev => [...prev, newData])
  // }
  const deleteOrder = async (id: number) => {
    console.log("I am deleting an order")
    const { error } = await supabase.from("Orders").delete().eq("id", id);
    console.log("I am done deleting an order")
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
      console.error("Failed to get current user:", authError);
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
      console.log("data[0].food is ", data[0].food)
      if (data && Array.isArray(data)) {
        const newOrders: Orders[] = data.map((order) => {
          const food = Array.isArray(order.food) ? order.food[0] : order.food;
      
          return {
            food,
            id: order.id,
            grabber_id: order.grabber_id,
            event_name: food.event[0]?.name ?? "Unknown",
            event_location: food.event[0]?.location ?? "Unknown",
          };
        });
      
        setOrders(newOrders);
      }
     }

    setLoading(false);
  };

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
        <OrderCard key={order.id} id={order.id} food={order.food} deleteOrder={deleteOrder} cancelOrder={cancelOrder} grabber_id={order.grabber_id} name={order.event_name} location={order.event_location} />
      ))}
      <p>LOL</p>
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