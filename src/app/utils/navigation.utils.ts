// styles/navigationStyles.ts

export const headerStyles = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 32px",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(8px)",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  borderBottom: "1px solid #e0e0e0",
  position: "sticky" as const,
  top: 0,
  zIndex: 999,
  minWidth: "1000px",
};

export const navLinksStyles = {
  display: "flex",
  gap: "28px",
  flexWrap: "wrap" as const,
  alignItems: "center",
  position: "relative" as const,
};

export const userDropdownContainerStyles = {
  position: "relative" as const,
  flexShrink: 0,
  minWidth: "fit-content",
  marginLeft: "auto",
  display: "flex",
};

export const welcomeStyles = {
  color: "#333",
  fontSize: "16px",
  cursor: "pointer",
  fontWeight: 500,
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

export const avatarContainerStyles = {
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "1px solid rgba(0,0,0,0.1)",
};

export const avatarImageStyles = {
  width: "100%",
  height: "100%",
};

export const avatarPlaceholderStyles = {
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  backgroundColor: "#f0f0f0",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "1px solid rgba(0,0,0,0.1)",
};

export const dropdownMenuStyles = {
  position: "absolute" as const,
  top: "110%",
  right: 0,
  backgroundColor: "white",
  border: "1px solid #e8e8e8",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  padding: "8px 0",
  zIndex: 1000,
  minWidth: "180px",
  maxWidth: "calc(100vw - 20px)",
  animation: "fadeIn 0.3s ease-in-out",
};

export const dropdownItemStyles = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "10px 20px",
  color: "#333",
  textDecoration: "none",
  fontSize: "15px",
  cursor: "pointer",
  transition: "background-color 0.3s",
  fontWeight: 400,
};

export const getLinkStyle = (pathname: string, href: string) => ({
  color: pathname === href ? "#fff" : "#444",
  textDecoration: "none",
  fontSize: "16px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontWeight: pathname === href ? 600 : 400,
  zIndex: 1,
  padding: "0 12px",
  height: "36px",
  borderRadius: "8px",
  position: "relative" as const,
  transition: "color 0.2s ease",
});
