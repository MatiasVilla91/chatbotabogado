// src/layouts/MainLayout.jsx
import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import UserMenu from "../components/UserMenu";
import PremiumBanner from "../components/PremiumBanner";
import { useLocation } from "react-router-dom";






const MainLayout = ({ children }) => {
  const { token } = useContext(AuthContext);
  const location = useLocation();

  const esLanding = location.pathname === "/caracteristicas"; // ajustá si usás otra ruta
  



  

  return (
  <Box
    sx={{
      display: "flex",
      minHeight: "100vh",
      height: "100vh",
      alignItems: "stretch",
      backgroundColor: esLanding ? "transparent" : "#111",
      flexDirection: { xs: "column", md: "row" },
    }}
  >
    <Sidebar />

    <Box
      component="main"
      sx={{
        flex: 1,
        px: esLanding ? 0 : { xs: 1, md:5 },
        pt: esLanding ? 0 : 5,
        pb: 0,
        minHeight: "100vh",
        overflowY: "auto",
        flexDirection: "column",
      }}
    >
      {!esLanding && <PremiumBanner />}

      {/* TOP RIGHT ACTIONS */}
      {!esLanding && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 2,
            mb: 0,
          }}
        >
          {!token ? (
            <>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                sx={{
                  color: "#fff",
                  borderColor: "#444",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#222",
                    borderColor: "#0a84ff",
                    color: "#0a84ff",
                  },
                }}
              >
                Iniciá sesión
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                sx={{
                  backgroundColor: "#0a84ff",
                  color: "#fff",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#006fdd",
                  },
                }}
              >
                Registrate
              </Button>
            </>
          ) : (
            <UserMenu />
          )}
        </Box>
      )}

      {children}
    </Box>
  </Box>
);

};

export default MainLayout;
