"use client";

import { useEffect, useState } from "react";
import { Card, Flex, Spin, Typography } from "antd";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ContactsPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
          quantity,
          allergies,
          serving_size_unit,
          event_id,
          event:event_id (
            name
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
  }, []);

  if (loading) {
    return (
      <Flex align="center" justify="center" style={{ height: "100vh" }}>
        <Spin size="large" />
      </Flex>
    );
  }

  return (
    <Flex wrap="wrap" gap="large" justify="center">
      {orders.map((order) => (
        <Card
          key={order.id}
          title={order.food.name}
          style={{ width: 300 }}
          bordered
        >
          <Typography.Paragraph>
            <strong>Event:</strong> {order.food.event?.name || "Unknown"}
          </Typography.Paragraph>
          <Typography.Paragraph>
            <strong>Calories:</strong> {order.food.calories}
          </Typography.Paragraph>
          <Typography.Paragraph>
            <strong>Carbs:</strong> {order.food.carbs}g
          </Typography.Paragraph>
          <Typography.Paragraph>
            <strong>Proteins:</strong> {order.food.proteins}g
          </Typography.Paragraph>
          <Typography.Paragraph>
            <strong>Fats:</strong> {order.food.fats}g
          </Typography.Paragraph>
          <Typography.Paragraph>
            <strong>Serving Size:</strong> {order.food.serving_size_u}
          </Typography.Paragraph>
          <Typography.Paragraph>
            <strong>Allergies:</strong> {order.food.allergies || "None"}
          </Typography.Paragraph>
          <Typography.Paragraph>
            <strong>Quantity Left:</strong> {order.food.quantity}
          </Typography.Paragraph>
          <Typography.Paragraph>
            <strong>User ID:</strong> {order.user_id}
          </Typography.Paragraph>
        </Card>
      ))}
    </Flex>
  );
}
