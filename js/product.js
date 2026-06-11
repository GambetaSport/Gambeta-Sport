/* ============================================================
   product.js  —  LÓGICA DE LA FICHA DE PRODUCTO
   ------------------------------------------------------------
   Lee el ?id= de la URL, carga ese producto, dibuja la galería
   (mockup / real / detalle), las telas y arma el botón de
   WhatsApp con el mensaje ya escrito.
   ============================================================ */

const Producto = {

  datos: null,            // el producto actual
  telaElegida: null,      // tela seleccionada para el mensaje

  async iniciar() {
    document.getElementById("marca").textContent = CONFIG.marca;

    const id = new URLSearchParams(location.search).get("id");
    if (!id) { this._mostrarError(); return; }

    try {
      this.datos = await Datos.obtenerProducto(id);
      if (!this.datos) { this._mostrarError(); return; }
      this._render();
    } catch (error) {
      console.error(error);
      this._mostrarError();
    }
  },

  _render() {
    const p = this.datos;
    document.title = p.nombre + " — " + CONFIG.marca;

    document.getElementById("categoria").textContent = p.categoria || "";
    document.getElementById("nombre").textContent = p.nombre;

    this._mostrarVista("mockup");
    this._pintarTelas();
    this._conectarVistas();

    // Tela por defecto: la primera disponible.
    this.telaElegida = (p.telas && p.telas[0]) || "";
    this._actualizarBotonWhatsApp();
  },

  /* Cambia la imagen mostrada según la vista elegida. */
  _mostrarVista(vista) {
    const cont = document.getElementById("galeria-imagen");
    const esDetalle = (vista === "detalle");
    cont.innerHTML =
      Componentes.imagenProducto(this.datos, vista, "", "galeria__placeholder") +
      (esDetalle ? `<span class="galeria__zoom-badge">ZOOM</span>` : "");
  },

  /* Conecta los botones de vista (mockup / real / detalle). */
  _conectarVistas() {
    document.querySelectorAll(".galeria__vista").forEach(boton => {
      boton.addEventListener("click", () => {
        document.querySelectorAll(".galeria__vista")
          .forEach(b => b.classList.remove("activo"));
        boton.classList.add("activo");
        this._mostrarVista(boton.dataset.vista);
      });
    });
  },

  /* Dibuja las telas disponibles del producto. */
 _pintarTelas() {
  const cont = document.getElementById("telas");
  const telas = this.datos.telas || [];
  if (telas.length === 0) {
    cont.parentElement.style.display = "none";
    return;
  }
  cont.innerHTML = telas.map(t => {
    const img = this.datos.telasImagenes ? this.datos.telasImagenes[t] : null;
    return Componentes.tela(t, img);
  }).join("");

  cont.querySelectorAll(".tela").forEach((el, i) => {
    el.addEventListener("click", () => {
      cont.querySelectorAll(".tela")
        .forEach(t => t.style.borderColor = "var(--borde)");
      el.style.borderColor = "var(--acento)";
      this.telaElegida = telas[i];
      this._actualizarBotonWhatsApp();
    });
  });
},

  /* Arma el link de WhatsApp con el mensaje pre-escrito. */
  _actualizarBotonWhatsApp() {
    const boton = document.getElementById("boton-whatsapp");
    boton.textContent = "";

    const texto =
      `Hola! Me interesa la remera *${this.datos.nombre}*.` +
      (this.telaElegida ? `\n\nTela de interés: ${this.telaElegida}` : "") +
      `\n\n¿Pueden darme un presupuesto?`;

    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;

    boton.href = url;
    boton.target = "_blank";
    boton.rel = "noopener";
    boton.innerHTML =
      `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
         <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.737-.979z"/>
       </svg>
       <span>${CONFIG.fraseBoton}</span>`;
  },

  _mostrarError() {
    document.querySelector(".contenedor").innerHTML =
      `<div class="vacio" style="padding:80px 20px">
         No se encontró el producto.
         <br><br><a href="index.html" style="color:var(--acento)">Volver al catálogo</a>
       </div>`;
  }
};

document.addEventListener("DOMContentLoaded", () => Producto.iniciar());
