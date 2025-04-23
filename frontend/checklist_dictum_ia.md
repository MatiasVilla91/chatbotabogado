# ✅ Checklist de Mejoras – DICTUM IA

## 1. Identidad Visual & Branding
- [ ] Agregar logo a la navbar.
- [ ] Mostrar nombre de la app (`DICTUM IA`) con tipografía clara.
- [ ] Añadir un slogan corto debajo o en hover.
- [ ] Crear favicon y logo SVG optimizado.

## 2. Página Principal (Home.jsx / NuevaHome)
- [ ] Reemplazar fondo liso por degradado sutil o imagen legal/tecnológica.
- [ ] Agregar ilustración o ícono representativo (ej: balanza con IA).
- [ ] Mostrar beneficios como tarjetas (`Card` con íconos y títulos).
- [ ] Agregar testimonios o frases de impacto.
- [ ] Animaciones suaves con `framer-motion` para los elementos.

## 3. Navbar y navegación
- [ ] Navbar fijo con transparencia y blur (ya hecho, ¡bien!).
- [ ] Mostrar íconos activos cuando estás en una sección.
- [ ] Agregar "Mi Cuenta" o "Perfil" cuando el usuario está logueado.
- [ ] Botón flotante o acceso rápido a la ayuda / contacto.

## 4. Consultas.jsx (chat legal)
- [ ] Mejorar estilo visual del área de mensajes (burbujas más suaves).
- [ ] Agregar íconos/avatars de usuario e IA.
- [ ] Indicador de escritura (`Typing...`) cuando responde.
- [ ] Sonido opcional al recibir respuesta.
- [ ] Accesibilidad: mejor contraste, labels ocultos para screen readers.

## 5. Login & Registro
- [ ] Diseño con grid de 2 columnas: formulario + ilustración.
- [ ] Mostrar validación en tiempo real.
- [ ] Agregar íconos en los `TextField`.
- [ ] Redirigir automáticamente al login luego de registrar.

## 6. UX Adicional
- [ ] Agregar Snackbar o alertas de éxito/error mejor estilizadas.
- [ ] Mostrar carga con esqueleto o `Skeleton` de MUI.
- [ ] Animaciones al cambiar de rutas (`Fade`, `Slide`, etc).
- [ ] Transición suave entre Home/Login/Consultas.

## 7. Marketing & Copywriting
- [ ] Revisar textos para que sean claros, breves y persuasivos.
- [ ] Incluir llamada a la acción visible (“Probalo ahora gratis”).
- [ ] Agregar botón de contacto o WhatsApp directo.

## 8. Producción y Seguridad
- [ ] Revisar si el token expira correctamente y hace logout.
- [ ] Validar inputs contra XSS o inyecciones.
- [ ] Agregar animaciones solo si no afectan el rendimiento.
- [ ] Revisión completa para lanzar versión 1.0.