import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Consultas from "./pages/Consultas";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Caracteristicas from "./pages/Caracteristicas"; // ✅ Ruta correcta
import FloatingHelpButton from "./components/FloatingHelpButton";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/consultas"
          element={
            <MainLayout>
              <Consultas />
            </MainLayout>
          }
        />
        <Route
          path="/caracteristicas"
          element={
            <MainLayout>
              <Caracteristicas />
            </MainLayout>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      <FloatingHelpButton />
    </>
  );
}

export default App;
