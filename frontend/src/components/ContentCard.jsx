import { Box, Paper } from "@mui/material";

const ContentCard = ({ children }) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        px: { xs: 2, md: 6 },
        py: { xs: 3, md: 6 },
      }}
    >
      <Paper
        elevation={8}
        sx={{
            width: "100%",
            maxWidth: { xs: "100%", md: "1000px", lg: "2000px" },
            mx: "auto",
            p: { xs: 3, md: 5, sm: 3 },
            borderRadius: "20px",
            background: "rgba(255, 255, 255, 0.04)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
      >
        {children}
      </Paper>
    </Box>
  );
};

export default ContentCard;
