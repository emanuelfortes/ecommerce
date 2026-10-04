import type { ArtKind, Product } from "@/lib/types";
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
  blocks: { eyebrow: string; title: string; text: string; art: ArtKind; color: string; tone: number; cta?: { label: string; href: string } }[];
  looks: { name: string; art: ArtKind; color: string; tone: number; productId: string }[];
  products: () => Product[];
}

export const campaigns: Campaign[] = [
  {
    slug: "aurora",
    name: "Aurora",
    season: "Primavera Verão 2027",
    headline: "A luz que nasce devagar",
    intro:
      "Aurora é o instante em que a noite cede ao dia. Uma coleção de cetins líquidos, linhos que respiram e pontos de luz dourada, criada para celebrar 15 anos de ateliê.",
    blocks: [
      {
        eyebrow: "Capítulo I · Cetim",
        title: "Fluidez que acompanha o movimento",
        text: "O vestido midi Aurora foi cortado em viés para deslizar sobre o corpo. O cetim de toque seco reflete a luz sem brilho excessivo, do café da manhã ao jantar.",
        art: "dress",
        color: "#D8C3A5",
        tone: 0,
        cta: { label: "Ver vestidos", href: "/categoria/vestidos" },
      },
      {
        eyebrow: "Capítulo II · Alfaiataria",
        title: "Estrutura com leveza",
        text: "Blazers alongados e calças de cintura alta em crepe de lã fria. Ombros precisos, forros de seda e botões banhados a ouro 18k.",
        art: "blazer",
        color: "#0D0D0D",
        tone: 2,
        cta: { label: "Explorar alfaiataria", href: "/colecao/alfaiataria" },
      },
      {
        eyebrow: "Capítulo III · Ouro",
        title: "O detalhe que assina",
        text: "Colares de elos, brincos de pérola e tiras douradas. Acessórios Maison Doré, feitos à mão em Franca, para pontuar o look com delicadeza.",
        art: "necklace",
        color: "#C6A15B",
        tone: 1,
        cta: { label: "Ver acessórios", href: "/categoria/acessorios" },
      },
    ],
    looks: [
      { name: "Look 01 · Amanhecer", art: "dress", color: "#D8C3A5", tone: 0, productId: "p1" },
      { name: "Look 02 · Atelier", art: "blazer", color: "#0D0D0D", tone: 1, productId: "p4" },
      { name: "Look 03 · Seda", art: "blouse", color: "#F7F4EF", tone: 2, productId: "p2" },
      { name: "Look 04 · Areia", art: "pants", color: "#CDBBA3", tone: 0, productId: "p3" },
      { name: "Look 05 · Plissê", art: "skirt", color: "#E8D8D2", tone: 1, productId: "p5" },
      { name: "Look 06 · Noite", art: "heels", color: "#0D0D0D", tone: 3, productId: "p7" },
    ],
    products: () => pick(["p1", "p4", "p2", "p3", "p5", "p11", "p7", "p20", "p12"]),
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
  art: ArtKind;
  color: string;
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
      "Blazers de ombros precisos, calças de cintura alta e macacões que vestem com intenção. Uma seleção curada para a mulher que decide, lidera e não abre mão do conforto.",
    art: "blazer",
    color: "#0D0D0D",
    highlights: ["Crepe de lã fria e linho italiano", "Modelagem exclusiva do ateliê", "Ajustes gratuitos na loja física"],
    featured: () => pick(["p4", "p3", "p19"]),
    all: () =>
      products.filter(
        (p) => ["blazers", "trench", "alfaiataria", "wide-leg", "camisas"].includes(p.subcategory) || p.id === "p19" || p.id === "p16"
      ),
    tips: [
      { title: "Ombro no lugar certo", text: "A costura do ombro do blazer deve terminar exatamente onde o seu ombro termina. É o ajuste mais difícil de corrigir depois." },
      { title: "Barra na medida do salto", text: "Para calças retas, a barra deve tocar o peito do pé com o sapato que você mais usa. Fazemos esse ajuste gratuitamente na loja." },
      { title: "Monocromia elegante", text: "Conjuntos no mesmo tom alongam a silhueta. Quebre com uma camisa de seda off-white e um ponto de luz dourado." },
      { title: "Do escritório ao jantar", text: "Troque a camisa por um top de cetim, acrescente brincos de pérola e um scarpin de bico fino. Pronto." },
    ],
    related: [
      { label: "Blazers", href: "/categoria/casacos/blazers" },
      { label: "Calças de alfaiataria", href: "/categoria/calcas/alfaiataria" },
      { label: "Camisas", href: "/categoria/blusas/camisas" },
    ],
  },
  {
    slug: "festa",
    name: "Festa",
    eyebrow: "Edit · Festa",
    headline: "Para noites inesquecíveis",
    intro:
      "Cetim, crepe e brilho na medida. Do casamento ao jantar de gala, uma curadoria de vestidos, acessórios e sapatos para brilhar com sofisticação e conforto até o fim da noite.",
    art: "dress",
    color: "#0D0D0D",
    highlights: ["Linha KM Noir", "Acessórios banhados a ouro 18k", "Consultoria de estilo por WhatsApp"],
    featured: () => pick(["p12", "p23", "p24"]),
    all: () =>
      products.filter(
        (p) => p.subcategory === "festa" || p.brand === "km-noir" || ["p1", "p7", "p11", "p20", "p23", "p24"].includes(p.id)
      ),
    tips: [
      { title: "Leia o dress code", text: "Black tie pede longo. Passeio completo aceita midi. Na dúvida, um midi de cetim com acessórios marcantes nunca erra." },
      { title: "Um único protagonista", text: "Se o vestido brilha, os acessórios sussurram. Se o vestido é sóbrio, deixe o colar ou a clutch falarem." },
      { title: "Conforto é elegância", text: "Teste o sapato em casa por uma hora antes do evento. Sandálias de tiras finas são aliadas de festas longas." },
      { title: "Casamento de dia", text: "Prefira tons claros como champagne e nude, tecidos fluidos e joias delicadas de pérola." },
    ],
    related: [
      { label: "Vestidos de festa", href: "/categoria/vestidos/festa" },
      { label: "Bolsas", href: "/categoria/acessorios/bolsas" },
      { label: "Joias", href: "/categoria/acessorios/joias" },
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
