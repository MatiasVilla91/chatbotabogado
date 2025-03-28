import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


import {  Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Consultas from "./pages/Consultas";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NuevaHome from "./pages/nuevahome"

function App() {
  //const [count, setCount] = useState(0)

  return (
    <>


      <Navbar />
      <Routes>
     

        <Route path="/" element={<NuevaHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/nuevahome" element={<NuevaHome />} /> {/* Nueva ruta */}
        <Route path="/register" element={<Register />} />
        <Route path="/consultas" element={<Consultas />} />
      </Routes>



     {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>*/}
    </>
  )
}

export default App
