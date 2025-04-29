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
        marginTop: "auto",
        backgroundColor: "#52c41a",
        padding: "2em",
        textAlign: "center",
        color: "#fff",
        fontWeight: 500,
        borderRadius: "12px",
        marginTop: "40px"
      }}>
        Please Contact Us with the emails above if you wish to post your own events.
      </div>


    </div>
  );
  
}