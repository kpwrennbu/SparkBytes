"use client";
import {Card, Typography, Button, Flex} from "antd";
import type { OrderCardProps } from "@/types"
export default function OrderCard({ id, food, deleteOrder, cancelOrder, grabber_id, name, location}: OrderCardProps) {
  console.log("order id, for order card", id)
  console.log("food, on order card: ", food);
  console.log("event: ", event)
    const onPickup = () => { 
        console.log("deleted order: ", id)
        deleteOrder(id)
    }
    const onCancellation = () => { 
        cancelOrder(id, food.id);
    }
    return (
    <Card
          key={id}
          title={food.name}
          style={{ width: 300 }}
        >
          <Typography.Paragraph>
            <strong>Event:</strong> {name || "Unknown"}
          </Typography.Paragraph>
          <Typography.Paragraph>
            <strong>Location:</strong> {location || "Unknown"}
          </Typography.Paragraph>
          <Typography.Paragraph>
            <strong>Calories:</strong> {food.calories} kcal
          </Typography.Paragraph>
          <Typography.Paragraph>
            <strong>Carbs:</strong> {food.carbs}g
          </Typography.Paragraph>
          <Typography.Paragraph>
            <strong>Proteins:</strong> {food.proteins}g
          </Typography.Paragraph>
          <Typography.Paragraph>
            <strong>Fats:</strong> {food.fats}g
          </Typography.Paragraph> 
          <Typography.Paragraph>
            <strong>Allergies:</strong> {food.allergies.join(" ") || "None"}
          </Typography.Paragraph>
          <Typography.Paragraph>
            <strong>User ID:</strong> {grabber_id}
          </Typography.Paragraph>
          <Flex gap="8px" justify="center" align="center"> 
            <Button onClick={() => onPickup()}>
                Picked Up!
            </Button>
            <Button onClick={() => onCancellation()}>
                Cancel Order
            </Button>
          </Flex>
        </Card> 
  );
}
