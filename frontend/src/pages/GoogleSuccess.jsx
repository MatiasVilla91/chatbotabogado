// GoogleSuccess.jsx
import { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function GoogleSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      login(token); // Guarda el token en el contexto y localStorage
      navigate("/consultas", { replace: true });
    } else {
      navigate("/login");
    }
  }, []);

  return <p>Iniciando sesión con Google...</p>;
}

export default GoogleSuccess;
