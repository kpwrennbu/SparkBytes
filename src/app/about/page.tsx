"use client";

import { Card } from "antd";
import Image from "next/image";
import { data, styles } from "../utils/about.utils"; // adjust path as needed

export default function AboutPage() {
  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Meet the SparkBytes Team ✨</h1>
      <div style={styles.divider}></div>

      <div style={styles.cardGrid}>
        {data.map((person) => (
          <Card
            key={person.email}
            hoverable
            style={styles.card}
            cover={
              <div style={styles.cardImageWrapper}>
                <Image
                  src={person.photo}
                  alt={person.name}
                  fill
                  style={styles.cardImage}
                />
              </div>
            }
          >
            <h3 style={styles.cardName}>{person.name}</h3>
            <p style={styles.cardDescription}>{person.description}</p>
            <a href={`mailto:${person.email}`}>{person.email}</a>
          </Card>
        ))}
      </div>

      <div style={styles.footer}>
        Please Contact One of Us with the Emails Above If You Wish to Post Your Own Events.
      </div>
    </div>
  );
}

