"use client";
import { useEffect, useState } from "react"; //react hooks
import { Flex, Spin, Typography, Empty } from "antd"; //antd sign in
import supabase from "../api/supabaseClient"; //supabase 
import OrderCard from "../components/OrderCard"; //external components
import { OrderItem } from "@/types"
export default function OrdersPage() {
  //states for orders and loading
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  //deleting an order can is synonomous with saying you placed an order
  const deleteOrder = async (id: number) => {
    const { error } = await supabase.from("Orders").delete().eq("id", id); //delete an order with id id
    if (error) { //catch error
      console.error(`Error deleting order with id ${id}:`, error);
    } else {
      console.log(`Successfully deleted order with id ${id}`); //log success
    }
    fetchOrders(); //re-fetch orders
  };

  //cancel order logic, synonomous with saying you canceled an order
  const cancelOrder = async (orderId: number, foodId: number) => {
    //delete order
    const { error: deleteError } = await supabase 
      .from("Orders")
      .delete()
      .eq("id", orderId);

      //if there is an error, log it
    if (deleteError) {
      console.error("Error deleting order:", deleteError);
      return;
    }
    
    //gets the quantity left of that food
    const { data, error: fetchError } = await supabase
      .from("Food")
      .select("quantity_left")
      .eq("id", foodId)
      .single();

    if (fetchError) {
      console.error("Error fetching food:", fetchError);
      return;
    }
    //updated quantity
    const updatedQuantity = data.quantity_left + 1;

    //updates the old quantity with the new quantity
    const { error: updateError } = await supabase
      .from("Food")
      .update({ quantity_left: updatedQuantity })
      .eq("id", foodId);

    if (updateError) { //logs error
      console.error("Error updating food quantity:", updateError);
    } else { //logs success
      console.log(`Successfully incremented quantity_left to ${updatedQuantity}`);
    }
    //fetches orders after finish
    fetchOrders();
  };

  //fetch orders function 
  const fetchOrders = async () => {
    //get current user to make orders
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    //if we did not get a user, handle it here
    if (authError || !user) {
      console.error("Failed to get current user:", authError);
      setOrders([]);
      setLoading(false);
      return;
    }

    //get the current order info at that specific user id
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
    //if error, log it accordingly, else set the orders
    if (error) {
      console.error("Error fetching orders:", error.message);
    } else {
      console.log("order data: ", data)
      setOrders(data)
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
