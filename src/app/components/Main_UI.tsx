import React from "react";
import { Typography } from "antd";
import Image from "next/image";

const { Title, Paragraph } = Typography;

export default function HeroSection() {
  return (
    <div style={{ textAlign: "center", padding: "1em 1em", background: "white" }}>
   
    

      <Title
        level={1}
        style={{
          fontWeight: "bold",
          fontSize: "2.5rem",
          lineHeight: "1.2",
          marginBottom: "0.5em",
        }}
      >
        SPARK!BYTES<br />FREE ACCESS TO EXTRA FOOD
      </Title>

      <div
        style={{
          width: "120px",
          height: "6px",
          backgroundColor: "#56B3A8",
          margin: "0 auto 1.5em auto",
        }}
      />

      <Paragraph style={{ fontSize: "1.1rem", maxWidth: "700px", margin: "0 auto" }}>
        SparkBytes is an innovative software platform that empowers Boston University to efficiently
        redistribute surplus food from events and programs. By connecting available food with students
        in need, SparkBytes reduces waste, supports sustainability, and strengthens community access
        across campus.
      </Paragraph>
    </div>
  );
}