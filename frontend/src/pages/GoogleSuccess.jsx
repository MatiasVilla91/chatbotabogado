import { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function GoogleSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext); // ✅ usa el contexto para guardar el token

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      login(token); // guarda en localStorage y contexto
      navigate("/consultas", { replace: true }); // ✅ navegación sin dejar token en la URL
    } else {
      navigate("/login");
    }
  }, []);

  return <p>Iniciando sesión con Google...</p>;
}

export default GoogleSuccess;
