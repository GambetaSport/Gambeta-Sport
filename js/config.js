const CONFIG = {

  /* --- Identidad de marca --- */
  marca: "GAMBETA",
  subtitulo: "EQUIPOS DEPORTIVOS DE CALIDAD",

  /* --- Contacto --- */
  // Número de WhatsApp en formato internacional, sin + ni espacios.
  // Paraguay: 595 + número sin el 0 inicial. Ej: 0981 234 567 -> 595981234567
  whatsapp: "595973687976",
  fraseBoton: "Solicita tu presupuesto",

  /* --- Imágenes (Cloudinary) --- */
  // Nombre de tu "cloud" en Cloudinary. Se usa para armar las URLs.
  // Mientras no haya fotos reales, dejá los campos de imagen vacíos
  // en productos.json y se muestra un placeholder automático.
  cloudinaryCloud: "gambeta",

  /* --- Fuente de datos --- */
  // Vacío ("")  -> lee data/productos.json (modo desarrollo / Fase 1-3)
  // URL          -> lee del Apps Script que sirve el Google Sheet (Fase 4)
  // Cambiar esto NO requiere tocar ningún otro archivo.
  fuenteDatos: "",

  /* --- Paleta de la marca --- */
  // Estos valores se inyectan como variables CSS al cargar la página.
  // Cambiar un color acá cambia toda la web.
  colores: {
    fondo:       "#0c0c0c",
    superficie:  "#141414",
    superficie2: "#1a1a1a",
    borde:       "#252525",
    acento:      "#FAC775",
    texto:       "#ffffff",
    textoTenue:  "#888888",
    textoSuave:  "#555555"
  },

  /* --- Colores disponibles para el filtro del catálogo --- */
  // "nombre" es la etiqueta visible; "valor" es el círculo de color.
  // El cliente puede ampliar esta lista desde el panel admin (Fase 5).
  coloresFiltro: [
    { nombre: "Negro",    valor: "#1c1c1c" },
    { nombre: "Blanco",   valor: "#e8e8e8" },
    { nombre: "Azul",     valor: "#0d2540" },
    { nombre: "Rojo",     valor: "#5a0d0d" },
    { nombre: "Verde",    valor: "#0d2d0d" },
    { nombre: "Amarillo", valor: "#9a7a00" }
  ]
};


/* ------------------------------------------------------------
   aplicarTema()
   Toma los colores de CONFIG y los inyecta como variables CSS.
   Por eso el CSS usa var(--acento) en vez de un color fijo:
   así un cambio en config.js se refleja en toda la web.
   ------------------------------------------------------------ */
function aplicarTema() {
  const raiz = document.documentElement;
  const c = CONFIG.colores;
  raiz.style.setProperty("--fondo", c.fondo);
  raiz.style.setProperty("--superficie", c.superficie);
  raiz.style.setProperty("--superficie-2", c.superficie2);
  raiz.style.setProperty("--borde", c.borde);
  raiz.style.setProperty("--acento", c.acento);
  raiz.style.setProperty("--texto", c.texto);
  raiz.style.setProperty("--texto-tenue", c.textoTenue);
  raiz.style.setProperty("--texto-suave", c.textoSuave);
}

aplicarTema();
