/* ============================================================
   catalog.js  —  LÓGICA DE LA PÁGINA PRINCIPAL
   ============================================================ */

const Catalogo = {
  productos: [],
  filtroColor: null,
  textoBusqueda: "",

  async iniciar() {
    this._pintarMarca();
    this._pintarFiltro();
    this._conectarEventos();
    this._mostrarCargando();

    try {
      this.productos = await Datos.obtenerProductos();
      this._render();
    } catch (error) {
      console.error(error);
      this._mostrarError();
    }
  },

  _mostrarCargando() {
    document.getElementById("grilla").innerHTML = `
      <div class="cargando-pelota" style="grid-column: 1 / -1;">
        <div class="pelota"></div>
        <div class="cargando-texto">Cargando diseños</div>
      </div>`;
  },

  _pintarMarca() {
    const marca = document.getElementById("marca");
    if (marca && marca.tagName !== "IMG") {
      marca.textContent = CONFIG.marca;
    }
    const subtitulo = document.getElementById("subtitulo");
    if (subtitulo) subtitulo.textContent = CONFIG.subtitulo;
    document.title = CONFIG.marca + " — Catálogo";
  },

  _pintarFiltro() {
    const panel = document.getElementById("filtro-panel");
    panel.innerHTML = CONFIG.coloresFiltro.map(c => Componentes.filtroColor(c)).join("");
  },

  _conectarEventos() {
    const toggle = document.getElementById("filtro-toggle");
    const panel = document.getElementById("filtro-panel");

    toggle.addEventListener("click", () => {
      const abierto = panel.classList.toggle("abierto");
      toggle.setAttribute("aria-expanded", abierto);
    });

    panel.addEventListener("click", (e) => {
      const boton = e.target.closest(".filtro__color");
      if (!boton) return;
      this._seleccionarColor(boton);
    });

    document.getElementById("buscador").addEventListener("input", (e) => {
      this.textoBusqueda = e.target.value.toLowerCase().trim();
      this._render();
    });
  },

  _seleccionarColor(boton) {
    const color = boton.dataset.color;
    const yaActivo = boton.classList.contains("activo");

    document.querySelectorAll(".filtro__color")
      .forEach(b => b.classList.remove("activo"));

    if (yaActivo) {
      this.filtroColor = null;
    } else {
      boton.classList.add("activo");
      this.filtroColor = color;
    }
    this._render();
  },

  _filtrar() {
    return this.productos.filter(p => {
      const coincideTexto =
        !this.textoBusqueda ||
        p.nombre.toLowerCase().includes(this.textoBusqueda) ||
        (p.categoria || "").toLowerCase().includes(this.textoBusqueda);

      const coincideColor =
        !this.filtroColor ||
        (p.colores && p.colores.includes(this.filtroColor));

      return coincideTexto && coincideColor;
    });
  },

  _render() {
    const grilla = document.getElementById("grilla");
    const visibles = this._filtrar();

    if (visibles.length === 0) {
      grilla.innerHTML = `<div class="vacio">No hay diseños que coincidan con tu búsqueda.</div>`;
      return;
    }
    grilla.innerHTML = visibles.map(p => Componentes.card(p)).join("");
  },

  _mostrarError() {
    document.getElementById("grilla").innerHTML =
      `<div class="vacio">No se pudieron cargar los diseños. Intentá recargar la página.</div>`;
  }
};

document.addEventListener("DOMContentLoaded", () => Catalogo.iniciar());
