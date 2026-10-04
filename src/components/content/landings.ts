import type { Product } from "@/lib/types";
import { getProduct, onSale, products } from "@/lib/data";

/* ------------------------------------------------------------------
   Conteúdo editorial das landing pages (telas 92, 93 e 94).
   Substitua por dados do seu CMS quando houver.
   ------------------------------------------------------------------ */

const pick = (ids: string[]) => ids.map((id) => getProduct(id)).filter((p): p is Product => !!p);

/* ---------- Campanhas (tela 92) ---------- */
export interface Campaign {
  slug: string;
  name: string;
  season: string;
  headline: string;
  intro: string;
  image: string;
  blocks: { eyebrow: string; title: string; text: string; image: string; cta?: { label: string; href: string } }[];
  looks: { name: string; productId: string }[];
  products: () => Product[];
}

export const campaigns: Campaign[] = [
  {
    slug: "aurora",
    name: "Aurora",
    season: "Primavera Verão 2027",
    headline: "Cores que vestem presença",
    intro:
      "Aurora é o instante em que a noite cede ao dia. Uma coleção de cetins que refletem a luz, pantalonas que dançam com o vento e crochê feito à mão, criada para celebrar 15 anos de ateliê.",
    image: "/img/vestido-longo-camadas-laranja.webp",
    blocks: [
      {
        eyebrow: "Capítulo I · Cetim",
        title: "Fluidez que acompanha o movimento",
        text: "O vestido midi Aurora desliza sobre o corpo com drapeado lateral e fenda que se revela a cada passo. O cetim champagne reflete a luz sem brilho excessivo, do jantar à festa.",
        image: "/img/vestido-midi-cetim-fenda-champagne.webp",
        cta: { label: "Ver vestidos", href: "/categoria/vestidos" },
      },
      {
        eyebrow: "Capítulo II · Alfaiataria",
        title: "Estrutura com leveza",
        text: "Blazers alongados, camisas de cetim e calças de cintura alta em azul marinho e off-white. Ombros precisos, botões dourados e caimento que alonga a silhueta.",
        image: "/img/conjunto-alfaiataria-blazer-camisa-cetim-azul-marinho.webp",
        cta: { label: "Explorar alfaiataria", href: "/colecao/alfaiataria" },
      },
      {
        eyebrow: "Capítulo III · Verão",
        title: "Leveza para dias de sol",
        text: "Conjuntos de pantalona em pink, preto e verde militar, vestidos longos em camadas e o crochê Ibiza feito à mão. Peças que respiram, da praia ao pôr do sol.",
        image: "/img/conjunto-croche-kimono-short-off-white.webp",
        cta: { label: "Ver conjuntos", href: "/categoria/conjuntos" },
      },
    ],
    looks: [
      { name: "Look 01 · Amanhecer", productId: "p3" },
      { name: "Look 02 · Atelier", productId: "p5" },
      { name: "Look 03 · Brisa", productId: "p4" },
      { name: "Look 04 · Esmeralda", productId: "p7" },
      { name: "Look 05 · Ibiza", productId: "p12" },
      { name: "Look 06 · Noite", productId: "p2" },
    ],
    products: () => pick(["p1", "p3", "p5", "p4", "p7", "p12", "p10", "p9", "p2"]),
  },
];

export const getCampaign = (slug: string) => campaigns.find((c) => c.slug === slug);

/* ---------- Coleções / edits de categoria (tela 93) ---------- */
export interface Collection {
  slug: string;
  name: string;
  eyebrow: string;
  headline: string;
  intro: string;
  image: string;
  highlights: string[];
  featured: () => Product[];
  all: () => Product[];
  tips: { title: string; text: string }[];
  related: { label: string; href: string }[];
}

export const collections: Collection[] = [
  {
    slug: "alfaiataria",
    name: "Alfaiataria",
    eyebrow: "Edit · Alfaiataria",
    headline: "Estrutura que fala por você",
    intro:
      "Terninhos de ombros precisos, calças de cintura alta e macacões que vestem com intenção. Uma seleção curada para a mulher que decide, lidera e não abre mão do conforto.",
    image: "/img/conjunto-alfaiataria-blazer-calca-off-white.webp",
    highlights: ["Crepe de lã fria e cetim acetinado", "Modelagem exclusiva do ateliê", "Ajustes gratuitos na loja física"],
    featured: () => pick(["p5", "p6", "p7"]),
    all: () => products.filter((p) => p.brand === "km-atelier"),
    tips: [
      { title: "Ombro no lugar certo", text: "A costura do ombro do blazer deve terminar exatamente onde o seu ombro termina. É o ajuste mais difícil de corrigir depois." },
      { title: "Barra na medida do salto", text: "Para calças de alfaiataria, a barra deve cobrir quase todo o sapato que você mais usa. Fazemos esse ajuste gratuitamente na loja." },
      { title: "Monocromia elegante", text: "Conjuntos no mesmo tom alongam a silhueta. O Veneza em azul marinho e o Milano em off-white são prova disso." },
      { title: "Do escritório ao jantar", text: "Troque a camisa por uma regata de cetim, solte o blazer sobre os ombros e finalize com um scarpin de bico fino." },
    ],
    related: [
      { label: "Terninhos", href: "/categoria/alfaiataria/terninhos" },
      { label: "Macacões", href: "/categoria/macacoes" },
      { label: "Conjunto com saia", href: "/categoria/conjuntos/saia" },
    ],
  },
  {
    slug: "festa",
    name: "Festa",
    eyebrow: "Edit · Festa",
    headline: "Para noites inesquecíveis",
    intro:
      "Cetim champagne, corset preto e verde esmeralda. Do casamento ao jantar de gala, uma curadoria de peças para brilhar com sofisticação e conforto até o fim da noite.",
    image: "/img/vestido-midi-corset-fenda-preto.webp",
    highlights: ["Linha KM Noir", "Fendas e corsets estruturados", "Consultoria de estilo por WhatsApp"],
    featured: () => pick(["p1", "p2", "p7"]),
    all: () => products.filter((p) => p.brand === "km-noir" || ["p4", "p7", "p8"].includes(p.id)),
    tips: [
      { title: "Leia o dress code", text: "Black tie pede longo. Passeio completo aceita midi. Na dúvida, um midi de cetim com sandália de tiras nunca erra." },
      { title: "Um único protagonista", text: "Se o vestido tem fenda e brilho, os acessórios sussurram. Se o corte é sóbrio, deixe um brinco marcante falar." },
      { title: "Conforto é elegância", text: "Teste o sapato em casa por uma hora antes do evento. Sandálias de tiras finas são aliadas de festas longas." },
      { title: "Casamento de dia", text: "Prefira tons claros como champagne e off-white, tecidos fluidos como o do vestido Brisa e joias delicadas." },
    ],
    related: [
      { label: "Vestidos midi", href: "/categoria/vestidos/midi" },
      { label: "Vestidos longos", href: "/categoria/vestidos/longos" },
      { label: "Macacões", href: "/categoria/macacoes" },
    ],
  },
];

export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);

/* ---------- Promoções (tela 94) ---------- */
export interface Promo {
  slug: string;
  name: string;
  headline: string;
  intro: string;
  startsAt: string;
  endsAt: string;
  coupon: { code: string; title: string; text: string };
  products: () => Product[];
  rules: string[];
}

export const promos: Promo[] = [
  {
    slug: "semana-dourada",
    name: "Semana Dourada",
    headline: "Até 30% off em peças selecionadas",
    intro:
      "Sete dias para garantir as queridinhas do ateliê com preços especiais. Estoque limitado, como tudo o que fazemos.",
    startsAt: "2026-10-01T00:00:00-03:00",
    endsAt: "2026-10-12T23:59:59-03:00",
    coupon: {
      code: "GOLD150",
      title: "R$ 150 OFF",
      text: "Em compras acima de R$ 1.200, cumulativo com os preços promocionais.",
    },
    products: () => onSale(),
    rules: [
      "Promoção válida de 01/10/2026 a 12/10/2026, às 23h59 (horário de Brasília), ou enquanto durarem os estoques.",
      "Descontos aplicados diretamente nos produtos participantes, sinalizados com o selo de porcentagem.",
      "O cupom GOLD150 é válido para compras acima de R$ 1.200,00 após os descontos e não é cumulativo com outros cupons.",
      "Parcelamento em até 6x sem juros e 5% de desconto adicional no PIX mantidos durante a campanha.",
      "Trocas seguem a política padrão: até 30 dias, com a primeira troca grátis.",
      "Não válida para compras realizadas antes do início da campanha.",
    ],
  },
];

export const getPromo = (slug: string) => promos.find((p) => p.slug === slug);
