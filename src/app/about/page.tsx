"use client";

import { Card, Typography } from "antd";
import Image from "next/image";
import { relative } from "path";
import { useState } from "react";

export default function AboutPage() {
  const data = [
    {
      name: "Tiffany Chen",
      description: "Search & Sort Features",
      email: "qtc@bu.edu",
      photo: "/tiffany.jpeg"
    },
    {
      name: "Justin Lim",
      description: "USDA API Call, General UI",
      email: "geolim@bu.edu",
      photo: "/justin.jpeg"
    },
    {
      name: "Wellington Oliveria",
      description: "Sign in & Sign up, DB",
      email: "wellijo@bu.edu",
      photo: "/wellington.jpeg"
    },
    {
      name: "Kevin Wrenn",
      description: "Food Card Logic, Create Events Logic, Orders Logic, DB setup",
      email: "kpwrenn@bu.edu",
      photo: "/kevin.jpg"
    },
  ];

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      padding: "40px 24px"
    }}>
      <h1 style={{ fontSize: "40px", fontWeight: 700, marginBottom: "40px", textAlign: "center", fontFamily: "Georgia, serif", color: "#333" }}>
        Meet the SparkBytes Team ✨
      </h1>
        <div
        style={{
          width: "23%", // a bit longer
          height: "4px",
          backgroundColor: "#67b3ad",
          margin: "-25px auto 40px", // 8px margin-top, 40px margin-bottom
          borderRadius: "2px",
        }}
      ></div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center" }}>
        {data.map((person) => (
          <Card
            key={person.email}
            hoverable
            style={{
              width: 280,
              borderRadius: 12,
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}
            cover={
              <div style={{ width: "100%", height: "250px", position: "relative", backgroundColor: "#fff" }}>
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

      <div style={{
        marginTop: "40px",
        padding: "1.5em",
        textAlign: "center",
        color: "#000000",
        fontWeight: 500,
        borderTop: "2px solid #67b3ad",
        borderBottom: "2px solid #67b3ad",
        fontFamily: "Segoe UI, sans-serif"
      }}>
        Please Contact One of Us with the Emails Above If You Wish to Post Your Own Events.
      </div>

      <footer style={{ marginTop: "2em", padding: "1.5em", textAlign: "center", fontSize: "14px", color: "#888" }}>
        &copy; {new Date().getFullYear()} SparkBytes. All rights reserved.
      </footer>
    </div>
  );
  
}