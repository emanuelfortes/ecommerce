/**
 * Atalhos para as DUAS únicas animações AOS do projeto.
 * Uso: <div {...aos.fadeUp(100)}> ou <div {...aos.zoomIn()}>
 * Funciona em Server e Client Components.
 */
export const aos = {
  fadeUp: (delay = 0) => ({ "data-aos": "fade-up", "data-aos-delay": String(delay) }),
  zoomIn: (delay = 0) => ({ "data-aos": "zoom-in", "data-aos-delay": String(delay) }),
};
