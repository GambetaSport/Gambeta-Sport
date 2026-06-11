/* ============================================================
   components.js  —  GENERADORES DE HTML
   ------------------------------------------------------------
   Funciones puras: reciben datos y devuelven HTML.
   No tocan la página directamente; solo arman el texto.
   Si querés cambiar cómo se ve una pieza, la tocás solo acá.
   ============================================================ */

const Componentes = {

  /* Ícono de remera reutilizable (para placeholders cuando no hay foto). */
  iconoRemera() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="var(--texto-suave)"
              stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 4l6 2v5h-3v8a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-8H3V6l6-2a3 3 0 0 0 6 0"/>
            </svg>`;
  },

  /* Devuelve el HTML de la imagen de un producto para una vista dada
     ("mockup" | "real" | "detalle"). Si no hay URL, muestra placeholder. */
  imagenProducto(producto, vista, claseImg, clasePlaceholder) {
    const url = producto.imagenes && producto.imagenes[vista];
    if (url) {
      return `<img src="${url}" alt="${producto.nombre} — ${vista}"
                   class="${claseImg}" loading="lazy"
                   onerror="this.outerHTML='<div class=\\'${clasePlaceholder}\\'>${this.iconoRemera()}</div>'">`;
    }
    return `<div class="${clasePlaceholder}">${this.iconoRemera()}</div>`;
  },

  /* Card de producto para la galería (solo imagen). */
  card(producto) {
    const imagen = this.imagenProducto(producto, "mockup", "", "card__placeholder");
    return `
      <a class="card" href="producto.html?id=${producto.id}" aria-label="${producto.nombre}">
        <div class="card__imagen">${imagen}</div>
      </a>`;
  },

  /* Un círculo de color para el filtro. */
  filtroColor(color) {
    return `
      <button class="filtro__color" data-color="${color.nombre}" type="button">
        <span class="filtro__color-dot" style="background:${color.valor}"></span>
        <span class="filtro__color-nombre">${color.nombre}</span>
      </button>`;
  },

  /* Un mosaico de tela en la ficha de producto. */
  tela(nombre) {
    return `
      <div class="tela">
        ${this.iconoRemera()}
        <div class="tela__nombre">${nombre}</div>
      </div>`;
  }
};
