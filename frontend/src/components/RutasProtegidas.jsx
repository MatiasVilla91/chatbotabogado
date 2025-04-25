import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// ✅ Ruta para usuarios logueados
export const RutaProtegida = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
};

// ✅ Ruta para visitantes (no logueados)
export const RutaPublica = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? <Navigate to="/consultas" /> : children;
};
