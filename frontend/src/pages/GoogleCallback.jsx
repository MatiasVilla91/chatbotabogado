import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function GoogleCallback() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      login(token);
      navigate("/consultas");
    } else {
      navigate("/login");
    }
  }, []);

  return <div>Procesando inicio de sesión con Google...</div>;
}

export default GoogleCallback;
