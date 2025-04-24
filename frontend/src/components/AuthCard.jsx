// src/components/AuthCard.jsx
import { Box, Paper } from "@mui/material";

const AuthCard = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(145deg, #0a0a0a 0%, #121212 100%)",
      }}
    >
      <Paper
        elevation={12}
        sx={{
          p: 4,
          backdropFilter: "blur(12px)",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "20px",
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 8px 32px rgba(2, 2, 2, 0.5)",
        }}
      >
        {children}
      </Paper>
    </Box>
  );
};

export default AuthCard;
