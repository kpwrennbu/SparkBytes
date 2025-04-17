import React from "react";
import { Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function HeroSection() {
  return (
    <div style={{ textAlign: "center", padding: "0em 1em", background: "white" }}>
   
    

      <Title
        level={1}
        style={{
          fontWeight: "bold",
          fontSize: "3.5rem",
          lineHeight: "1.2",
          marginBottom: "0.0em",
        }}
      >
        SPARK!BYTES<br />
      </Title>
      <Paragraph style={{ fontSize: "1rem", maxWidth: "900px", margin: "0 auto" }}>
       FREE ACCESS TO SURPLUS OF FOOD
      </Paragraph>

      <div
        style={{
          width: "120px",
          height: "6px",
          backgroundColor: "#56B3A8",
          margin: "1.5em auto 1.5em auto",
        }}
      />

      <Paragraph style={{ fontSize: "1rem", maxWidth: "900px", margin: "0.0 auto" , marginBottom: "2em"}}>
        Spark!Bytes is an innovative software platform that allows BU to efficiently redistribute surplus food from events and programs to students, staff, and professors. 
        By connecting available food with students in need, SparkBytes reduces waste, supports sustainability, and strengthens community access across campus.
      </Paragraph>
    </div>
  );
}