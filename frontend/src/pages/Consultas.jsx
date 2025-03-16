import { useState, useContext, useEffect, useRef } from "react";
import { Container, TextField, Button, Typography, Paper, Box, IconButton } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { SyncLoader } from "react-spinners";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

//BOTONPAGO MERCADOPAGO
const handlePayment = async () => {
  try {
    const response = await axios.post(`${backendUrl}/api/payment`, {
      description: "Asesoría Legal IA",
      price: 1000,
      quantity: 1,
    });

    window.location.href = response.data.init_point;
  } catch (error) {
    console.error("❌ Error al iniciar el pago:", error.response ? error.response.data : error.message);
    alert("Error al iniciar el pago, revisa la consola para más detalles.");
  }
};



//FIN BOTON MP

function Consultas() {
  const { token } = useContext(AuthContext);
  const [pregunta, setPregunta] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setMensajes((prev) => [...prev, { tipo: "received", texto: "No tienes un token válido. Inicia sesión." }]);
      return;
    }

    setMensajes((prev) => [...prev, { tipo: "sent", texto: pregunta }]);
    setPregunta("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${backendUrl}/api/legal/consulta`,
        { pregunta },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensajes((prev) => [...prev, { tipo: "received", texto: response.data.respuesta }]);
    } catch (error) {
      setMensajes((prev) => [...prev, { tipo: "received", texto: "Error al obtener respuesta de la IA." }]);
    }
    finally{
    setIsLoading(false); }// Aquí se asegura de que el loader desaparezca.
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        
     {/* <img 
  src="https://th.bing.com/th/id/R.f4da75dd614e2135e6d43fbd96d89d16?rik=uIrd1SKwijPfvg&pid=ImgRaw&r=0" 
  alt="Descripción de la imagen" 
  style={{ width: '100px', height: 'auto', borderRadius: '8px' }} 
/>*/} 
      </Typography>
      <Box sx={{ height: "60vh", overflowY: "auto", mb: 2, p: 2, backgroundColor: '#121212', borderRadius: 2, boxShadow: '0 4px 10px rgba(255, 16, 16, 0.1)' }}>
        {mensajes.map((msg, index) => (
      <Typography key={index} variant="body1" sx={{ 
        padding: '0.8em 1em', 
        borderRadius: '12px', 
        marginBottom: '0.5em', 
        wordBreak: 'break-word',
        backgroundColor: msg.tipo === 'sent' ? '#2e2e2e' : msg.tipo === 'received' ? ' #5E5C5C' : '#aeaeaeae',
        fontSize: '1.2em'
        
      }}>
        {msg.texto}
      </Typography>
          
        ))}

         {/* Loader mientras espera la respuesta */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <SyncLoader color="#eeee" size={10} />
          </Box>
        )}

        <div ref={chatEndRef} />
      </Box>

      <Paper component="form" onSubmit={handleSubmit} elevation={2} sx={{ p: 2, display: "flex", alignItems: "center", gap: 2, borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} autoComplete="off">
        <TextField
          fullWidth
          placeholder="Escribe tu consulta legal..."
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          variant="outlined"
          sx={{ borderRadius: '12px' }}
        />
        <IconButton type="submit" color="primary" sx={{ backgroundColor: '#454646', '&:hover': { backgroundColor: '#0b5ed7' } }}>
          <SendIcon sx={{ color: '#fff' }} />
        </IconButton>

       

      </Paper>
      <Button 
  variant="contained" 
  color="secondary" 
  fullWidth 
  sx={{ mt: 3 }}
  onClick={handlePayment}
>
  Pagar con MercadoPago
</Button>
    </Container>
  );
}

export default Consultas;
