import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // ✅ Importamos el contexto
import Sidebar from "../components/Sidebar";

const MainLayout = ({ children }) => {
  const { token, logout } = useContext(AuthContext); // ✅ Accedemos al token

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#111" }}>
      <Sidebar />

      <Box component="main" sx={{ flex: 1, p: 4 }}>
        {/* TOP RIGHT ACTIONS */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mb: 4,
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
            <Button
              onClick={logout}
              variant="outlined"
              sx={{
                color: "#ccc",
                borderColor: "#444",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#222",
                  borderColor: "#0a84ff",
                  color: "#0a84ff",
                },
              }}
            >
              Cerrar sesión
            </Button>
          )}
        </Box>

        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
