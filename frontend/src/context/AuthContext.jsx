// AuthContext.jsx
import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // ✅ Sincronizamos el token solo cuando el usuario cambia
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", user.token);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user]);

  const login = (newToken, userData) => {
    setUser({
      token: newToken,
      ...userData,
    });
    console.log("✅ Usuario autenticado:", { token: newToken, ...userData });
  };

  const logout = () => {
    setUser(null);
    console.log("✅ Usuario cerrado sesión.");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
