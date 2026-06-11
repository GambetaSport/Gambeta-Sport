/* ============================================================
   catalog.js  —  LÓGICA DE LA PÁGINA PRINCIPAL
   ------------------------------------------------------------
   Carga los productos, los dibuja en la grilla y maneja la
   búsqueda y el filtro por color (desplegable).
   ============================================================ */

const Catalogo = {

  productos: [],          // todos los productos cargados
  filtroColor: null,      // color seleccionado, o null = todos
  textoBusqueda: "",      // texto del buscador

  /* Punto de entrada: se llama al cargar la página. */
  async iniciar() {
    this._pintarMarca();
    this._pintarFiltro();
    this._conectarEventos();

    try {
      this.productos = await Datos.obtenerProductos();
      this._render();
    } catch (error) {
      console.error(error);
      this._mostrarError();
    }
  },

  /* Escribe el nombre y subtítulo de la marca en el header. */
  _pintarMarca() {
    document.getElementById("marca").textContent = CONFIG.marca;
    document.getElementById("subtitulo").textContent = CONFIG.subtitulo;
    document.title = CONFIG.marca + " — Catálogo";
  },

  /* Dibuja los círculos de color del filtro a partir de config.js. */
  _pintarFiltro() {
    const panel = document.getElementById("filtro-panel");
    panel.innerHTML = CONFIG.coloresFiltro.map(c => Componentes.filtroColor(c)).join("");
  },

  /* Conecta los eventos: toggle del filtro, clicks de color, búsqueda. */
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

  /* Marca un color como activo (o lo desmarca si ya estaba). */
  _seleccionarColor(boton) {
    const color = boton.dataset.color;
    const yaActivo = boton.classList.contains("activo");

    document.querySelectorAll(".filtro__color")
      .forEach(b => b.classList.remove("activo"));

    if (yaActivo) {
      this.filtroColor = null;          // vuelve a mostrar todos
    } else {
      boton.classList.add("activo");
      this.filtroColor = color;
    }
    this._render();
  },

  /* Aplica búsqueda + filtro y devuelve los productos visibles. */
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

  /* Dibuja la grilla con los productos visibles. */
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
