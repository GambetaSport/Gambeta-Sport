/* ============================================================
   catalog.js  —  LÓGICA DE LA PÁGINA PRINCIPAL
   - Buscador: busca por nombre, categoría, color y tela
   - Filtro de colores: se genera solo desde los productos
   ============================================================ */

/* Diccionario de colores: nombre (en minúscula) -> color real.
   Si un color no está acá, usa un gris neutro.
   Podés agregar más cuando quieras. */
const COLORES_HEX = {
  "negro": "#1a1a1a",
  "blanco": "#f5f5f5",
  "rojo": "#d32f2f",
  "azul": "#1976d2",
  "azul marino": "#1a237e",
  "marino": "#1a237e",
  "celeste": "#4fc3f7",
  "verde": "#388e3c",
  "amarillo": "#fbc02d",
  "naranja": "#f57c00",
  "gris": "#9e9e9e",
  "rosa": "#ec407a",
  "rosado": "#ec407a",
  "violeta": "#7b1fa2",
  "morado": "#7b1fa2",
  "lila": "#b39ddb",
  "bordo": "#800020",
  "bordó": "#800020",
  "vinotinto": "#800020",
  "dorado": "#FAC775",
  "plateado": "#c0c0c0",
  "marron": "#6d4c41",
  "marrón": "#6d4c41",
  "cafe": "#6d4c41",
  "café": "#6d4c41",
  "turquesa": "#1abc9c",
  "fucsia": "#e91e63",
  "beige": "#d7ccc8"
};

const Catalogo = {
  productos: [],
  filtroColor: null,
  textoBusqueda: "",

  async iniciar() {
    this._pintarMarca();
    this._conectarEventos();
    this._mostrarCargando();

    try {
      this.productos = await Datos.obtenerProductos();
      this._pintarFiltro();   // se genera con los colores reales
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

  _hexColor(nombre) {
    const clave = (nombre || "").toLowerCase().trim();
    return COLORES_HEX[clave] || "#9e9e9e";
  },

  _pintarFiltro() {
    const panel = document.getElementById("filtro-panel");

    // Recolectar todos los colores únicos de los productos
    const set = new Set();
    this.productos.forEach(p => {
      (p.colores || []).forEach(c => {
        const limpio = (c || "").trim();
        if (limpio) set.add(limpio);
      });
    });
    const colores = Array.from(set).sort();

    if (colores.length === 0) {
      panel.innerHTML = `<div style="color:var(--texto-suave); font-size:13px; padding:8px;">Sin colores cargados</div>`;
      return;
    }

    panel.innerHTML = colores.map(nombre => {
      return Componentes.filtroColor({ nombre: nombre, valor: this._hexColor(nombre) });
    }).join("");
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
    const texto = this.textoBusqueda;
    return this.productos.filter(p => {
      // Texto: busca en nombre, categoría, colores y telas
      const colores = (p.colores || []).join(" ").toLowerCase();
      const telas = (p.telas || []).join(" ").toLowerCase();
      const coincideTexto =
        !texto ||
        p.nombre.toLowerCase().includes(texto) ||
        (p.categoria || "").toLowerCase().includes(texto) ||
        colores.includes(texto) ||
        telas.includes(texto);

      // Filtro de color seleccionado
      const coincideColor =
        !this.filtroColor ||
        (p.colores && p.colores.indexOf(this.filtroColor) !== -1);

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
