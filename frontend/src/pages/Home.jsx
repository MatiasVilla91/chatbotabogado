import {
  Box,
  Typography,
  Button,
  Grid,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ShieldIcon from "@mui/icons-material/Shield";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
  const isMobile = useMediaQuery('(max-width:600px)');
  const location = useLocation();
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      setShowMessage(true);
    }
  }, [location]);

  return (
    <Box
      sx={{
        minHeight: "90vh", //en un futuro modificar a 100
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
        Inteligencia Artificial Legal a tu servicio
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

      {/* ✅ Snackbar */}
      <Snackbar
        open={showMessage}
        autoHideDuration={3000}
        onClose={() => setShowMessage(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowMessage(false)}
          severity="info"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {location.state?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Home;
