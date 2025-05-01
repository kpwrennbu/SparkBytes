export const styles = {
    page: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "32px 16px",
      fontFamily: "Segoe UI, sans-serif",
    },
    header: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      marginBottom: "32px",
    },
    controlBar: {
      display: "flex",
      flexWrap: "wrap" as const,
      justifyContent: "space-between",
      gap: "16px",
      marginBottom: "24px",
      padding: "0 12px",
    },
    sortControls: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      flexWrap: "wrap" as const,
    },
    searchInput: {
      padding: "10px",
      borderRadius: "8px",
      fontSize: "16px",
      width: "300px",
      flex: "1 0 250px",
    },
  
  
  };