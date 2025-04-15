"use client";
import {Card, Typography, Button, Flex} from "antd";

export default function OrderCard({ order, deleteOrder, cancelOrder}) {
    const onPickup = () => { 
        console.log("deleted order: ", order)
        // deleteOrder(order.id)
    }
    const onCancellation = () => { 
        cancelOrder(order.id, order.food.id);
    }
    return (
    <Card
          key={order.id}
          title={order.food.name}
          style={{ width: 300 }}
        >
          <Typography.Paragraph>
            <strong>Event:</strong> {order.food.event?.name || "Unknown"}
          </Typography.Paragraph>
          <Typography.Paragraph>
            <strong>Location:</strong> {order.food.event?.location || "Unknown"}
          </Typography.Paragraph>
          <Typography.Paragraph>
            <strong>Calories:</strong> {order.food.calories} kcal
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
            <strong>Allergies:</strong> {order.food.allergies.join(" ") || "None"}
          </Typography.Paragraph>
          <Typography.Paragraph>
            <strong>User ID:</strong> {order.student_id}
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
