import React from "react";
import { Typography } from "antd";
import Image from "next/image";

const { Title, Paragraph } = Typography;

export default function MissionStatement() {
  const styles = {
    header: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      marginBottom: "32px",
    },
    title: {
      fontWeight: "bold",
      fontSize: "3.5rem",
      lineHeight: "1.2",
      marginBottom: "0.0em",
    },
    freeAccess: {
      fontSize: "1rem",
       maxWidth: "900px", 
       margin: "0 auto" 
      },
      missionStatementWrapper: {
        width: "120px",
        height: "6px",
        backgroundColor: "#56B3A8",
        margin: "1.5em auto 1.5em auto",
      },
      missionStatement: { fontSize: "1rem", maxWidth: "900px", margin: "0.0 auto" , marginBottom: "2em"}
  }
  return (
    <div style={{ textAlign: "center", padding: "0em 1em", background: "white" }}>
   
        <div style={styles.header}>
          <Image src="/Spark.png" alt="SparkBytes Logo" width={350} height={200} />
        </div>
  

      <Title
        level={1}
        style={styles.title}
      >
        SPARK!BYTES<br />
      </Title>
      <Paragraph style={styles.freeAccess}>
       FREE ACCESS TO SURPLUS OF FOOD
      </Paragraph>

      <div
        style={styles.missionStatementWrapper}
      />

      <Paragraph style={styles.missionStatement}>
        Spark!Bytes is an innovative software platform that allows BU to efficiently redistribute surplus food from events and programs to students, staff, and professors. 
        By connecting available food with students in need, SparkBytes reduces waste, supports sustainability, and strengthens community access across campus.
      </Paragraph>
    </div>
  );
}