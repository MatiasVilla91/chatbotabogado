import {
  Box,
  Typography,
  Button,
  Grid,
  useMediaQuery
} from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ShieldIcon from "@mui/icons-material/Shield";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Link } from "react-router-dom";

function Home() {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#111",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        textAlign: "center",
        px: 2,
        pt: isMobile ? 10 : 14,
      }}
    >
      <Typography
        variant={isMobile ? "h4" : "h3"}
        sx={{
          fontWeight: "bold",
          color: "#fff",
          mb: 2,
          whiteSpace: "nowrap",
        }}
      >
        Dictum IA
      </Typography>

      <Typography variant="h6" color="#ccc" sx={{ mb: 4, maxWidth: 500 }}>
        La inteligencia artificial legal a tu servicio.
      </Typography>

      <Button
        component={Link}
        to="/login"
        variant="contained"
        sx={{
          backgroundColor: "#0a84ff",
          color: "#fff",
          borderRadius: "12px",
          px: 4,
          py: 1.5,
          fontWeight: "bold",
          mb: 6,
          "&:hover": {
            backgroundColor: "#006fdd",
          },
        }}
      >
        Accedé Ahora
      </Button>

      
    </Box>
  );
}

export default Home;
