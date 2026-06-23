/* ============================================================
   components.js  —  GENERADORES DE HTML
   ============================================================ */

const Componentes = {

  /* Optimiza una URL de imagen pasándola por wsrv.nl
     - w: ancho máximo en píxeles
     - q: calidad (1-100)
     Esto reduce el peso y acelera la carga sin tocar las fotos originales. */
 optimizar(url, ancho) {
    if (!url) return "";
    // La tela Mesh no se optimiza (wsrv no la procesa bien)
    if (url.indexOf("tela-micro") !== -1) return url;
    if (url.indexOf("wsrv.nl") !== -1) return url;
    const limpia = url.replace(/^https?:\/\//, "");
    return `https://wsrv.nl/?url=${encodeURIComponent(limpia)}&w=${ancho}&q=75&output=webp`;
  },
  iconoRemera() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="var(--texto-suave)"
              stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 4l6 2v5h-3v8a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-8H3V6l6-2a3 3 0 0 0 6 0"/>
            </svg>`;
  },

  imagenProducto(producto, vista, claseImg, clasePlaceholder, ancho) {
    const urlOriginal = producto.imagenes && producto.imagenes[vista];
    if (urlOriginal) {
      const url = this.optimizar(urlOriginal, ancho || 800);
      return `<img src="${url}" alt="${producto.nombre} — ${vista}"
                   class="${claseImg}" loading="lazy"
                   onerror="this.outerHTML='<div class=\\'${clasePlaceholder}\\'>${this.iconoRemera()}</div>'">`;
    }
    return `<div class="${clasePlaceholder}">${this.iconoRemera()}</div>`;
  },

  card(producto) {
    const imagen = this.imagenProducto(producto, "mockup", "", "card__placeholder", 500);
    return `
      <a class="card" href="producto.html?id=${producto.id}" aria-label="${producto.nombre}">
        <div class="card__imagen">${imagen}</div>
      </a>`;
  },

  filtroColor(color) {
    return `
      <button class="filtro__color" data-color="${color.nombre}" type="button">
        <span class="filtro__color-dot" style="background:${color.valor}"></span>
        <span class="filtro__color-nombre">${color.nombre}</span>
      </button>`;
  },

  tela(nombre, imagen) {
    const contenido = imagen
      ? `<img src="${this.optimizar(imagen, 200)}" alt="${nombre}" style="width:100%; height:60px; object-fit: contain; border-radius: 4px; cursor:pointer;" onclick="abrirModalTela('${imagen}', '${nombre}')">`
      : this.iconoRemera();
    return `
      <div class="tela">
        ${contenido}
        <div class="tela__nombre">${nombre}</div>
      </div>`;
  }
};
