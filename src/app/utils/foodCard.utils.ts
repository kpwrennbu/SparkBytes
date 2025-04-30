// utils/foodUtils.ts
export const allergies: Record<string, string> = {
  dairy: "/allergyIcons/dairy-free.png",
  egg: "/allergyIcons/egg-free.png",
  fish: "/allergyIcons/fish-free.png",
  gluten: "/allergyIcons/gluten-free.png",
  peanut: "/allergyIcons/peanut-free.png",
  seafood: "/allergyIcons/seafood-free.png",
  soy: "/allergyIcons/soy-free.png",
  "tree Nut": "/allergyIcons/treeNut-free.png",
};

export const imgs: Record<string, string> = {
  cds: "/CDS.jpg",
  warren: "/WarrenTowers.jpg",
  gsu: "/GSU.jpg",
};

export const formattedLocations: Record<string, string> = {
  cds: "Center for Computing and Data Sciences",
  warren: "Warren Towers",
  gsu: "George Sherman Union",
};

export const addresses: Record<string, string> = {
  cds: "665 Commonwealth Ave",
  warren: "700 Commonwealth Ave",
  gsu: "775 Commonwealth Ave",
};

export const formatTimeRange = (start: string, end: string): string => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const sameDay = startDate.toDateString() === endDate.toDateString();

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
  };

  const formattedDate = startDate.toLocaleDateString(undefined, dateOptions);
  const startTime = startDate.toLocaleTimeString(undefined, timeOptions);
  const endTime = endDate.toLocaleTimeString(undefined, timeOptions);

  return sameDay
    ? `${formattedDate}, ${startTime} - ${endTime}`
    : `${formattedDate} ${startTime} - ${endDate.toLocaleDateString(undefined, dateOptions)} ${endTime}`;
};

export const styles = {
    card: {
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      width: "100%",
      maxWidth: "350px",
      padding: "0.5em",
    },
    imageCover: {
      width: "100%",
      height: "200px",
      position: "relative" as const,
    },
    eventName: {
      marginBottom: "5px",
      fontWeight: "bold",
    },
    locationText: {
      color: "#666",
      marginBottom: "8px",
    },
    time: {
      fontWeight: "500",
      fontSize: "14px",
      color: "#444",
      marginTop: "10px",
    },
    modalBody: {
      height: "100vh",
      margin: 0,
      padding: 0,
    },
    modalImage: {
      width: "30%",
      height: "500px",
      position: "relative" as const,
    },
    modalContent: {
      width: "70%",
      height: "500px",
      position: "relative" as const,
    },
    tableWrapper: {
      display: "flex",
      justifyContent: "center",
      flexDirection: "column" as const,
      alignItems: "center",
    },
    table: {
      width: "75%",
    },
    buttonGroup: {
      gap: "8px",
    },
  };
  