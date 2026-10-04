import type { Product, Review } from "@/lib/types";
import { reviews as allReviews } from "@/lib/data";

/** Avaliações do produto. Quando ainda não há avaliações cadastradas, usa depoimentos genéricos de demonstração. */
export function reviewsFor(p: Product): Review[] {
  const own = allReviews.filter((r) => r.productId === p.id);
  if (own.length) return own;
  const size = p.sizes[Math.min(1, p.sizes.length - 1)] ?? "Único";
  return [
    {
      id: `${p.id}-g1`,
      productId: p.id,
      author: "Mariana C.",
      rating: 5,
      title: "Superou as expectativas",
      body: `A qualidade do ${p.composition.toLowerCase()} é visível ao toque. Acabamento de ateliê e entrega muito rápida.`,
      date: "2026-09-18",
      size,
      fit: "perfeito",
      verified: true,
      helpful: 14,
    },
    {
      id: `${p.id}-g2`,
      productId: p.id,
      author: "Aline P.",
      rating: 5,
      title: "Elegante e confortável",
      body: "Usei o dia inteiro sem desconforto. Recebi muitos elogios e já quero em outra cor.",
      date: "2026-09-03",
      size,
      fit: "perfeito",
      verified: true,
      helpful: 8,
    },
    {
      id: `${p.id}-g3`,
      productId: p.id,
      author: "Tatiane R.",
      rating: 4,
      title: "Linda, atenção ao tamanho",
      body: "Peça linda e bem feita. Achei a modelagem um pouco justa, se estiver entre dois tamanhos escolha o maior.",
      date: "2026-08-21",
      size,
      fit: "pequeno",
      verified: true,
      helpful: 5,
    },
  ];
}

/** Distribuição de notas (em %) estimada a partir da média do produto. */
export function ratingDistribution(rating: number) {
  const five = Math.max(5, Math.min(95, Math.round(((rating - 3.5) / 1.5) * 85 + 10)));
  let rest = 100 - five;
  const four = Math.round(rest * 0.6);
  rest -= four;
  const three = Math.round(rest * 0.6);
  rest -= three;
  const two = Math.round(rest * 0.6);
  const one = rest - two;
  return [
    { stars: 5, pct: five },
    { stars: 4, pct: four },
    { stars: 3, pct: three },
    { stars: 2, pct: two },
    { stars: 1, pct: one },
  ];
}

/** Tabela de medidas (cm) por tamanho. */
export const measurements: Record<string, { busto?: number; cintura?: number; quadril?: number; pe?: number }> = {
  PP: { busto: 80, cintura: 62, quadril: 88 },
  P: { busto: 86, cintura: 66, quadril: 94 },
  M: { busto: 92, cintura: 72, quadril: 100 },
  G: { busto: 98, cintura: 78, quadril: 106 },
  GG: { busto: 104, cintura: 84, quadril: 112 },
  "36": { cintura: 66, quadril: 92 },
  "38": { cintura: 70, quadril: 96 },
  "40": { cintura: 74, quadril: 100 },
  "42": { cintura: 78, quadril: 104 },
  "44": { cintura: 82, quadril: 108 },
};

export const shoeLength: Record<string, number> = {
  "34": 22.5,
  "35": 23.2,
  "36": 23.9,
  "37": 24.6,
  "38": 25.3,
  "39": 26,
};

export const stockLabel = {
  disponivel: "https://schema.org/InStock",
  esgotado: "https://schema.org/OutOfStock",
  indisponivel: "https://schema.org/Discontinued",
} as const;
