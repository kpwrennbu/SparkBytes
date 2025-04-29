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
      padding: "40px 24px"
    },
    header: {
      fontSize: "40px",
      fontWeight: 700,
      marginBottom: "40px",
      textAlign: "center",
      fontFamily: "Georgia, serif",
      color: "#333"
    },
    cardsContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: 24,
      justifyContent: "center"
    },
    card: {
      width: 280,
      borderRadius: 12,
      textAlign: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
    },
    imageWrapper: {
      width: "100%",
      height: "250px",
      position: "relative",
      backgroundColor: "#fff"
    },
    footer: {
      marginTop: "auto",
      backgroundColor: "#52c41a",
      padding: "2em",
      textAlign: "center",
      color: "#fff",
      fontWeight: 500,
      borderRadius: "12px",
    }
  };
  