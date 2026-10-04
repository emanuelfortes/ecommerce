/** Foto que representa cada marca nas páginas de marcas. */
export const brandImage: Record<string, string> = {
  "km-atelier": "/img/conjunto-alfaiataria-blazer-camisa-cetim-azul-marinho.webp",
  "km-essentials": "/img/vestido-longo-camadas-laranja.webp",
  "km-noir": "/img/vestido-midi-corset-fenda-preto.webp",
};

export const getBrandImage = (slug: string) => brandImage[slug] ?? "/img/vestido-midi-cetim-fenda-champagne.webp";
