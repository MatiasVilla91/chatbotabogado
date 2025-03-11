import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext"; // 👈 Importa el contexto
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from './theme';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider> {/* ✅ Aquí se envuelve toda la app con el AuthProvider */}
      <BrowserRouter>
      <ThemeProvider theme={theme}>
      <CssBaseline />
        <App />
       </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
