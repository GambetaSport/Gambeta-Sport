/* ============================================================
   product.js  —  LÓGICA DE LA FICHA DE PRODUCTO
   ============================================================ */


const Producto = {

  datos: null,
  telaElegida: null,

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

    this.telaElegida = (p.telas && p.telas[0]) || "";
  },

  _mostrarVista(vista) {
    const cont = document.getElementById("galeria-imagen");
    const esDetalle = (vista === "detalle");
    cont.innerHTML =
      Componentes.imagenProducto(this.datos, vista, "", "galeria__placeholder") +
      (esDetalle ? `<span class="galeria__zoom-badge">ZOOM</span>` : "");
  },

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
      });
    });
  },

  _mostrarError() {
    document.querySelector(".contenedor").innerHTML =
      `<div class="vacio" style="padding:80px 20px">
         No se encontró el producto.
         <br><br><a href="index.html" style="color:var(--acento)">Volver al catálogo</a>
       </div>`;
  }
};

/* Abrir modal de tela */
function abrirModalTela(src, nombre) {
  const modal = document.getElementById("modal-tela");
  document.getElementById("modal-tela-img").src = src;
  document.getElementById("modal-tela-nombre").textContent = nombre;
  modal.style.display = "flex";
}

/* Cerrar modal de tela */
function cerrarModalTela() {
  document.getElementById("modal-tela").style.display = "none";
}

/* Cerrar modal al tocar fuera */
document.addEventListener("click", (e) => {
  const modal = document.getElementById("modal-tela");
  if (e.target === modal) {
    cerrarModalTela();
  }
});

document.addEventListener("DOMContentLoaded", () => Producto.iniciar());
