import type { CSSProperties } from "react"; //needed for styles to work

//this is the data block, hard coded with names, description of what they worked on, emails and a path to their picture
export const data = [
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
    }
  ];
  //this is the styling for the document
  export const styles : { [key: string]: CSSProperties } = {
    page: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      padding: "40px 24px",
    },
    title: {
      fontSize: "40px",
      fontWeight: 700,
      marginBottom: "40px",
      textAlign: "center",
      fontFamily: "Georgia, serif",
      color: "#333",
    },
    divider: {
      width: "23%",
      height: "4px",
      backgroundColor: "#67b3ad",
      margin: "-25px auto 40px",
      borderRadius: "2px",
    },
    cardGrid: {
      display: "flex",
      flexWrap: "wrap",
      gap: 24,
      justifyContent: "center",
    },
    card: {
      width: 280,
      borderRadius: 12,
      textAlign: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    },
    cardImageWrapper: {
      width: "100%",
      height: "250px",
      position: "relative",
      backgroundColor: "#fff",
    },
    cardImage: {
      objectFit: "cover",
      borderRadius: "12px 12px 0 0",
    },
    cardName: {
      marginBottom: 8,
    },
    cardDescription: {
      color: "#555",
      marginBottom: 8,
    },
    footer: {
      marginTop: "40px",
      padding: "1.5em",
      textAlign: "center",
      color: "#000000",
      fontWeight: 500,
      borderTop: "2px solid #67b3ad",
      borderBottom: "2px solid #67b3ad",
      fontFamily: "Segoe UI, sans-serif",
    },
  };
  