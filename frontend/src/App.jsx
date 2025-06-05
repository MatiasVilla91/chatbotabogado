import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Consultas from "./pages/Consultas";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Caracteristicas from "./pages/Caracteristicas";
// import FloatingHelpButton from "./components/FloatingHelpButton";
import MainLayout from "./layouts/MainLayout";
import PoliticaPrivacidad from "./pages/PoliticaPrivacidad";
import TerminosCondiciones from "./pages/TerminosCondiciones";
import Planes from "./pages/Planes";
import Precios from "./pages/Precios";
import Historial from "./pages/Historial";
import { RutaProtegida, RutaPublica } from "./components/RutasProtegidas";
import GoogleSuccess from "./pages/GoogleSuccess";
import Perfil from "./pages/Perfil";
import SobreNosotros from "./pages/SobreNosotros";
import OlvideContrasena from "./pages/OlvideContrasena";
import RestablecerContrasena from "./pages/RestablecerContrasena";
import VerificarCuenta from "./pages/verificarCuenta";

function App() {
  return (
    <>
      <Routes>
        {/* Página principal */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />

        {/* 🔒 Rutas protegidas */}
        <Route
          path="/consultas"
          element={
            <RutaProtegida>
              <MainLayout>
                <Consultas />
              </MainLayout>
            </RutaProtegida>
          }
        />
        <Route
          path="/historial"
          element={
            <RutaProtegida>
              <MainLayout>
                <Historial />
              </MainLayout>
            </RutaProtegida>
          }
        />
        <Route
          path="/perfil"
          element={
            <RutaProtegida>
              <MainLayout>
                <Perfil />
              </MainLayout>
            </RutaProtegida>
          }
        />

        {/* 🌐 Rutas públicas */}
        <Route
          path="/login"
          element={
            <RutaPublica>
              <Login />
            </RutaPublica>
          }
        />
        <Route
          path="/register"
          element={
            <RutaPublica>
              <Register />
            </RutaPublica>
          }
        />

        {/* 🌍 Acceso libre */}
        <Route
          path="/caracteristicas"
          element={
            <MainLayout>
              <Caracteristicas />
            </MainLayout>
          }
        />
        <Route
          path="/planes"
          element={
            <MainLayout>
              <Planes />
            </MainLayout>
          }
        />
        <Route
          path="/precios"
          element={
            <MainLayout>
              <Precios />
            </MainLayout>
          }
        />
        <Route
          path="/terminos"
          element={
            <MainLayout>
              <TerminosCondiciones />
            </MainLayout>
          }
        />
        <Route
          path="/privacidad"
          element={
            <MainLayout>
              <PoliticaPrivacidad />
            </MainLayout>
          }
        />
        <Route path="/google-success" element={<GoogleSuccess />} />
        <Route path="/sobre-nosotros" element={<SobreNosotros />} />
        <Route path="/olvide-contrasena" element={<OlvideContrasena />} />
        <Route path="/reset-password/:token" element={<RestablecerContrasena />} />

        {/* ✅ Email verification dentro de Routes */}
        <Route path="/verify-email/:token" element={<VerificarCuenta />} />
      </Routes>

      {/* <FloatingHelpButton /> */}
    </>
  );
}

export default App;
