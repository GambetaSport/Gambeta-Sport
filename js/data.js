/* ============================================================
   data.js  —  CAPA DE DATOS
   ------------------------------------------------------------
   Es el ÚNICO archivo que sabe DE DÓNDE vienen los productos.
   El resto del código pide "dame los productos" y no le importa
   si vienen de un JSON local o de Google Sheets.

   Para pasar de datos locales a Google Sheets (Fase 4):
   solo poné la URL en CONFIG.fuenteDatos. Nada más cambia.
   ============================================================ */

const Datos = {

  // Guarda los productos ya cargados para no pedirlos dos veces.
  _cache: null,

  /* Devuelve la lista completa de productos activos. */
  async obtenerProductos() {
    if (this._cache) return this._cache;

    let productos;

    if (CONFIG.fuenteDatos) {
      // Fase 4 en adelante: leer del Apps Script (Google Sheets).
      try {
        const resp = await fetch(CONFIG.fuenteDatos);
        productos = await resp.json();
      } catch (error) {
        console.warn("No se pudo leer la fuente remota. Uso datos locales.", error);
        productos = await this._leerLocal();
      }
    } else {
      // Fase 1-3: leer el JSON local de prueba.
      productos = await this._leerLocal();
    }

    // Solo mostramos los productos marcados como activos.
    this._cache = productos.filter(p => p.activo !== false);
    return this._cache;
  },

  /* Devuelve un solo producto por su id, o null si no existe. */
  async obtenerProducto(id) {
    const productos = await this.obtenerProductos();
    return productos.find(p => p.id === id) || null;
  },

  /* Lee el archivo JSON local. Privado: lo usa solo este archivo. */
  async _leerLocal() {
    const resp = await fetch("data/productos.json");
    if (!resp.ok) throw new Error("No se encontró data/productos.json");
    return await resp.json();
  }
};
