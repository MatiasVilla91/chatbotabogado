// src/components/PerfilCardWrapper.jsx
import { Box } from "@mui/material";

const PerfilCardWrapper = ({ children }) => {
  return (
    <Box
      sx={{
        maxWidth: "600px",
        width: "100%",
        p: 4,
        background: "rgba(255, 255, 255, 0.04)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "20px",
      }}
    >
      {children}
    </Box>
  );
};

export default PerfilCardWrapper;
