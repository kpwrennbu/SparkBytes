"use client";
import { Card } from "antd";
import Image from "next/image";
import {data, styles} from "./about.utils";
export default function AboutPage() {
  
  return (
    <div style={styles.page}>
      <h1 style={styles.header}>Meet the SparkBytes Team ✨</h1>

      <div style={styles.cardsContainer}>
        {data.map((person) => (
          <Card
            key={person.email}
            hoverable
            style={styles.card}
            cover={
              <div style={styles.imageWrapper}>
                <Image
                  src={person.photo}
                  alt={person.name}
                  fill
                  style={{ objectFit: "cover", borderRadius: "12px 12px 0 0" }}
                />
              </div>
            }
          >
            <h3 style={{ marginBottom: 8 }}>{person.name}</h3>
            <p style={{ color: "#555", marginBottom: 8 }}>{person.description}</p>
            <a href={`mailto:${person.email}`}>{person.email}</a>
          </Card>
        ))}
      </div>

      <div style={styles.footer}>
        Please Contact Us with the emails above if you wish to post your own events.
      </div>
    </div>
  );
  
}