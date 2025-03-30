import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Nueva función para verificar el token
  const verificarToken = () => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiracion = payload.exp * 1000;
      if (Date.now() >= expiracion) {
        setToken(null);
        localStorage.removeItem("token");
        alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      }
    } catch (error) {
      console.error("Error al verificar el token:", error);
      setToken(null);
      localStorage.removeItem("token");
    }
  };

  useEffect(() => {
    if (token) {
      verificarToken();
    }
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export { AuthContext, AuthProvider };
