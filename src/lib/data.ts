import type {
  Address,
  BlogAuthor,
  BlogPost,
  Brand,
  Category,
  Coupon,
  Order,
  Product,
  Question,
  Review,
  ShippingOption,
} from "./types";

/* ------------------------------------------------------------------
   Dados de demonstração. Substitua por chamadas à sua API/CMS.
   ------------------------------------------------------------------ */

const img = (file: string) => `/img/${file}.webp`;

export const categories: Category[] = [
  {
    slug: "vestidos",
    name: "Vestidos",
    description: "Do longo em camadas ao midi de cetim, silhuetas que valorizam cada curva.",
    art: "dress",
    image: img("vestido-midi-cetim-fenda-champagne"),
    subcategories: [
      { slug: "longos", name: "Longos" },
      { slug: "midi", name: "Midi" },
    ],
  },
  {
    slug: "conjuntos",
    name: "Conjuntos",
    description: "Pantalonas fluidas, tops de amarração e crochê artesanal. Um look completo em duas peças.",
    art: "pants",
    image: img("conjunto-top-amarracao-calca-pantalona-pink"),
    subcategories: [
      { slug: "pantalona", name: "Com Pantalona" },
      { slug: "saia", name: "Com Saia" },
      { slug: "croche", name: "Crochê" },
    ],
  },
  {
    slug: "alfaiataria",
    name: "Alfaiataria",
    description: "Blazers de ombros precisos e calças de cintura alta para vestir com intenção.",
    art: "blazer",
    image: img("conjunto-alfaiataria-blazer-camisa-cetim-azul-marinho"),
    subcategories: [{ slug: "terninhos", name: "Terninhos" }],
  },
  {
    slug: "macacoes",
    name: "Macacões",
    description: "Uma peça, um look completo.",
    art: "jumpsuit",
    image: img("macacao-pantalona-cinto-verde-esmeralda"),
    subcategories: [
      { slug: "longos", name: "Longos" },
      { slug: "curtos", name: "Curtos" },
    ],
  },
];

export const brands: Brand[] = [
  {
    slug: "km-atelier",
    name: "KM Atelier",
    tagline: "Alfaiataria com assinatura",
    description:
      "A linha assinatura da Karen Michelly: terninhos, macacões e camisas de cetim desenhados no nosso ateliê e produzidos em pequenas tiragens.",
    origin: "São Paulo, Brasil",
  },
  {
    slug: "km-essentials",
    name: "KM Essentials",
    tagline: "Leveza para os dias de sol",
    description:
      "Conjuntos de pantalona, vestidos longos em camadas e crochê artesanal. Tecidos que respiram, cores vivas e conforto absoluto.",
    origin: "Minas Gerais, Brasil",
  },
  {
    slug: "km-noir",
    name: "KM Noir",
    tagline: "Para noites inesquecíveis",
    description: "Festa e ocasião. Cetim que reflete a luz, corsets estruturados e fendas na medida certa.",
    origin: "Rio de Janeiro, Brasil",
  },
];

const care = [
  "Lavar à mão com água fria",
  "Não usar alvejante",
  "Secar à sombra",
  "Passar em temperatura baixa",
];

export const products: Product[] = [
  {
    id: "p1",
    slug: "vestido-midi-cetim-aurora",
    name: "Vestido Midi Cetim Aurora",
    category: "vestidos",
    subcategory: "midi",
    brand: "km-noir",
    price: 689.9,
    oldPrice: 789.9,
    rating: 4.9,
    reviewsCount: 128,
    colors: [{ name: "Champagne", hex: "#D8C3A5" }],
    sizes: ["PP", "P", "M", "G", "GG"],
    stock: "disponivel",
    isBestseller: true,
    description:
      "Cetim de toque acetinado com decote degagê, alças finas e drapeado lateral que marca a cintura. A fenda lateral dá movimento a cada passo, do jantar à festa.",
    details: ["Decote degagê", "Drapeado lateral", "Fenda lateral", "Alças finas"],
    composition: "97% Poliéster, 3% Elastano",
    care,
    art: "dress",
    tone: 0,
    images: [img("vestido-midi-cetim-fenda-champagne")],
    sold: 980,
    createdAt: "2026-08-20",
  },
  {
    id: "p2",
    slug: "vestido-midi-corset-noir",
    name: "Vestido Midi Corset Noir",
    category: "vestidos",
    subcategory: "midi",
    brand: "km-noir",
    price: 599.9,
    rating: 4.8,
    reviewsCount: 74,
    colors: [{ name: "Preto", hex: "#0D0D0D" }],
    sizes: ["PP", "P", "M", "G", "GG"],
    stock: "disponivel",
    isBestseller: true,
    description:
      "Busto em corset estruturado com barbatanas, mangas bufantes em chiffon e saia drapeada com fenda frontal. O pretinho que resolve qualquer noite.",
    details: ["Corset com barbatanas", "Mangas bufantes em chiffon", "Fenda frontal", "Zíper invisível"],
    composition: "95% Poliéster, 5% Elastano",
    care,
    art: "dress",
    tone: 3,
    images: [img("vestido-midi-corset-fenda-preto")],
    sold: 860,
    createdAt: "2026-07-14",
  },
  {
    id: "p3",
    slug: "vestido-longo-camadas-solar",
    name: "Vestido Longo Camadas Solar",
    category: "vestidos",
    subcategory: "longos",
    brand: "km-essentials",
    price: 459.9,
    rating: 4.8,
    reviewsCount: 52,
    colors: [{ name: "Laranja", hex: "#E36B1E" }],
    sizes: ["P", "M", "G", "GG"],
    stock: "disponivel",
    isNew: true,
    description:
      "Busto franzido com amarração central, costas em lastex e saia ampla em camadas. Viscose texturizada que flui com o vento e uma cor que é puro verão.",
    details: ["Amarração no busto", "Lastex nas costas", "Saia em camadas", "Alças reguláveis"],
    composition: "100% Viscose",
    care,
    art: "dress",
    tone: 1,
    images: [img("vestido-longo-camadas-laranja")],
    sold: 310,
    createdAt: "2026-09-29",
  },
  {
    id: "p4",
    slug: "vestido-longo-argola-brisa",
    name: "Vestido Longo Argola Brisa",
    category: "vestidos",
    subcategory: "longos",
    brand: "km-essentials",
    price: 489.9,
    oldPrice: 569.9,
    rating: 4.7,
    reviewsCount: 46,
    colors: [{ name: "Off-White", hex: "#F7F4EF" }],
    sizes: ["P", "M", "G", "GG"],
    stock: "disponivel",
    description:
      "Frente única com argola no decote, recortes laterais vazados e saia longa em camadas. Gaze de algodão leve, perfeita para casamentos de dia e férias na praia.",
    details: ["Frente única", "Argola no decote", "Recortes laterais", "Saia em camadas"],
    composition: "100% Algodão",
    care,
    art: "dress",
    tone: 2,
    images: [img("vestido-longo-argola-off-white")],
    sold: 420,
    createdAt: "2026-08-05",
  },
  {
    id: "p5",
    slug: "conjunto-alfaiataria-veneza",
    name: "Conjunto Alfaiataria Veneza",
    category: "alfaiataria",
    subcategory: "terninhos",
    brand: "km-atelier",
    price: 1290.0,
    oldPrice: 1490.0,
    rating: 4.9,
    reviewsCount: 64,
    colors: [{ name: "Azul Marinho", hex: "#1F2A4A" }],
    sizes: ["36", "38", "40", "42", "44"],
    stock: "disponivel",
    isBestseller: true,
    description:
      "Três peças em azul marinho: blazer alongado, camisa de cetim com punhos bufantes e calça pantalona de cintura alta com pregas. Poder e fluidez no mesmo tom.",
    details: ["Blazer alongado", "Camisa de cetim", "Calça com pregas frontais", "Bolsos faca"],
    composition: "Blazer e calça em crepe de alfaiataria, camisa 97% Poliéster e 3% Elastano",
    care: ["Lavagem a seco", "Passar a vapor"],
    art: "blazer",
    tone: 3,
    images: [img("conjunto-alfaiataria-blazer-camisa-cetim-azul-marinho")],
    sold: 640,
    createdAt: "2026-06-01",
  },
  {
    id: "p6",
    slug: "conjunto-alfaiataria-milano",
    name: "Conjunto Alfaiataria Milano",
    category: "alfaiataria",
    subcategory: "terninhos",
    brand: "km-atelier",
    price: 1190.0,
    rating: 4.9,
    reviewsCount: 38,
    colors: [{ name: "Off-White", hex: "#F7F4EF" }],
    sizes: ["36", "38", "40", "42", "44"],
    stock: "disponivel",
    isNew: true,
    description:
      "Blazer acinturado com botões dourados e calça reta de cintura alta com vinco. Use com a regata de cetim para uma produção monocromática impecável.",
    details: ["Botões dourados", "Ombreiras leves", "Calça com vinco", "Forro acetinado"],
    composition: "Crepe de lã fria",
    care: ["Lavagem a seco", "Passar a vapor"],
    art: "blazer",
    tone: 0,
    images: [img("conjunto-alfaiataria-blazer-calca-off-white")],
    sold: 280,
    createdAt: "2026-09-26",
  },
  {
    id: "p7",
    slug: "macacao-pantalona-esmeralda",
    name: "Macacão Pantalona Esmeralda",
    category: "macacoes",
    subcategory: "longos",
    brand: "km-atelier",
    price: 649.9,
    rating: 4.8,
    reviewsCount: 57,
    colors: [{ name: "Verde Esmeralda", hex: "#1F6B45" }],
    sizes: ["P", "M", "G", "GG"],
    stock: "disponivel",
    isBestseller: true,
    description:
      "Decote coração com recortes de bojo, cinto encapado com fivela e pernas amplas com vinco. Uma peça só, presença do primeiro ao último passo.",
    details: ["Decote coração", "Cinto encapado", "Pernas amplas", "Bolsos laterais"],
    composition: "95% Poliéster, 5% Elastano",
    care,
    art: "jumpsuit",
    tone: 1,
    images: [img("macacao-pantalona-cinto-verde-esmeralda")],
    sold: 590,
    createdAt: "2026-07-22",
  },
  {
    id: "p8",
    slug: "conjunto-camisa-saia-lumiere",
    name: "Conjunto Camisa e Saia Lumière",
    category: "conjuntos",
    subcategory: "saia",
    brand: "km-atelier",
    price: 729.9,
    oldPrice: 849.9,
    rating: 4.7,
    reviewsCount: 33,
    colors: [{ name: "Rosa e Off-White", hex: "#E6BFBF" }],
    sizes: ["P", "M", "G", "GG"],
    stock: "indisponivel",
    description:
      "Camisa de cetim rosa com mangas bufantes e saia midi evasê off-white de cintura alta. Feminino, fluido e pronto para o brunch ou o escritório.",
    details: ["Camisa de cetim", "Mangas bufantes", "Saia midi evasê", "Cintura alta"],
    composition: "97% Poliéster, 3% Elastano",
    care,
    art: "skirt",
    tone: 1,
    images: [img("camisa-cetim-rosa-saia-midi-off-white")],
    sold: 190,
    createdAt: "2026-08-12",
  },
  {
    id: "p9",
    slug: "conjunto-pantalona-riviera",
    name: "Conjunto Pantalona Riviera",
    category: "conjuntos",
    subcategory: "pantalona",
    brand: "km-essentials",
    price: 359.9,
    rating: 4.8,
    reviewsCount: 112,
    colors: [{ name: "Preto", hex: "#0D0D0D" }],
    sizes: ["P", "M", "G", "GG"],
    stock: "disponivel",
    isBestseller: true,
    description:
      "Top faixa franzido com argola dourada e calça pantalona com cós elástico e cordão. O preto que vai da praia ao jantar sem esforço.",
    details: ["Top com argola dourada", "Cós elástico com cordão", "Pernas amplas"],
    composition: "100% Viscose",
    care,
    art: "pants",
    tone: 3,
    images: [img("conjunto-top-calca-pantalona-preto")],
    sold: 1120,
    createdAt: "2026-05-11",
  },
  {
    id: "p10",
    slug: "conjunto-pantalona-capri",
    name: "Conjunto Pantalona Capri",
    category: "conjuntos",
    subcategory: "pantalona",
    brand: "km-essentials",
    price: 349.9,
    oldPrice: 499.9,
    rating: 4.7,
    reviewsCount: 88,
    colors: [{ name: "Pink", hex: "#E0218A" }],
    sizes: ["P", "M", "G", "GG"],
    stock: "disponivel",
    isNew: true,
    description:
      "Top de amarração frontal com bojo leve e pantalona de cintura alta com cordão. Um pink vibrante que não passa despercebido.",
    details: ["Top com amarração frontal", "Bojo removível", "Pantalona com cordão"],
    composition: "100% Viscose",
    care,
    art: "pants",
    tone: 0,
    images: [img("conjunto-top-amarracao-calca-pantalona-pink")],
    sold: 470,
    createdAt: "2026-09-20",
  },
  {
    id: "p11",
    slug: "conjunto-cropped-amalfi",
    name: "Conjunto Cropped Amalfi",
    category: "conjuntos",
    subcategory: "pantalona",
    brand: "km-essentials",
    price: 379.9,
    rating: 4.6,
    reviewsCount: 41,
    colors: [{ name: "Verde Militar", hex: "#5B6B2F" }],
    sizes: ["P", "M", "G", "GG"],
    stock: "esgotado",
    description:
      "Cropped com mangas borboleta e amarração frontal, pantalona com cordão e ponteiras douradas. Tecido texturizado em verde militar.",
    details: ["Mangas borboleta", "Amarração frontal", "Ponteiras douradas", "Tecido texturizado"],
    composition: "100% Viscose",
    care,
    art: "pants",
    tone: 2,
    images: [img("conjunto-cropped-amarracao-calca-pantalona-verde-militar")],
    sold: 330,
    createdAt: "2026-07-07",
  },
  {
    id: "p12",
    slug: "conjunto-croche-ibiza",
    name: "Conjunto Crochê Ibiza",
    category: "conjuntos",
    subcategory: "croche",
    brand: "km-essentials",
    price: 549.9,
    rating: 5,
    reviewsCount: 29,
    colors: [{ name: "Off-White", hex: "#F7F4EF" }],
    sizes: ["P", "M", "G"],
    stock: "disponivel",
    isNew: true,
    description:
      "Três peças em crochê artesanal: kimono longo com mangas amplas, top franzido e short com cordão. Feito à mão para dias de sol e noites de verão.",
    details: ["Crochê artesanal", "Kimono longo", "Top franzido", "Short com cordão"],
    composition: "100% Algodão",
    care: ["Lavar à mão com água fria", "Secar na horizontal", "Não torcer"],
    art: "swim",
    tone: 0,
    images: [img("conjunto-croche-kimono-short-off-white")],
    sold: 210,
    createdAt: "2026-10-01",
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    productId: "p1",
    author: "Juliana M.",
    rating: 5,
    title: "Caimento perfeito",
    body: "O cetim é lindíssimo e o corte enviesado valoriza muito. Usei em um casamento e recebi elogios a noite toda.",
    date: "2026-09-12",
    size: "P",
    fit: "perfeito",
    verified: true,
    helpful: 24,
  },
  {
    id: "r2",
    productId: "p1",
    author: "Beatriz A.",
    rating: 5,
    title: "Acabamento impecável",
    body: "Chegou em uma embalagem linda, com cheirinho. O tecido é encorpado e não amassa fácil.",
    date: "2026-08-30",
    size: "M",
    fit: "perfeito",
    verified: true,
    helpful: 12,
  },
  {
    id: "r3",
    productId: "p1",
    author: "Camila R.",
    rating: 4,
    title: "Lindo, mas veste um pouco grande",
    body: "Amei a cor champagne. Recomendo pegar um número abaixo se estiver entre dois tamanhos.",
    date: "2026-08-14",
    size: "M",
    fit: "grande",
    verified: true,
    helpful: 9,
  },
  {
    id: "r4",
    productId: "p5",
    author: "Fernanda L.",
    rating: 5,
    title: "Meu conjunto favorito",
    body: "Usei em duas reuniões importantes e me senti poderosa. A calça alonga muito e a camisa de cetim é confortável o dia inteiro.",
    date: "2026-09-02",
    size: "38",
    fit: "perfeito",
    verified: true,
    helpful: 31,
  },
  {
    id: "r5",
    productId: "p6",
    author: "Patrícia S.",
    rating: 5,
    title: "Vale cada centavo",
    body: "Estrutura de blazer importado. Os botões dourados dão um toque muito chique.",
    date: "2026-07-21",
    size: "40",
    fit: "perfeito",
    verified: true,
    helpful: 17,
  },
];

export const questions: Question[] = [
  {
    id: "q1",
    productId: "p1",
    author: "Larissa",
    question: "O tecido é transparente na cor champagne?",
    answer:
      "Olá, Larissa! O vestido possui forro interno, então não há transparência. Beijos, equipe Karen Michelly.",
    date: "2026-09-10",
  },
  {
    id: "q2",
    productId: "p1",
    author: "Renata",
    question: "Qual o comprimento do tamanho M?",
    answer: "Oi, Renata! No tamanho M o comprimento é de 118cm do ombro à barra.",
    date: "2026-08-22",
  },
  {
    id: "q3",
    productId: "p1",
    author: "Paula",
    question: "Tem previsão de chegar na cor verde?",
    date: "2026-10-01",
  },
];

export const coupons: Coupon[] = [
  {
    code: "BEMVINDA10",
    title: "10% na primeira compra",
    description: "Válido para novas clientes em todo o site.",
    type: "percent",
    value: 10,
    minValue: 0,
    expiresAt: "2026-12-31",
    status: "ativo",
  },
  {
    code: "KMFRETE",
    title: "Frete grátis",
    description: "Frete grátis para compras acima de R$ 399.",
    type: "shipping",
    value: 0,
    minValue: 399,
    expiresAt: "2026-11-30",
    status: "ativo",
  },
  {
    code: "GOLD150",
    title: "R$ 150 OFF",
    description: "Desconto fixo em compras acima de R$ 1.200.",
    type: "fixed",
    value: 150,
    minValue: 1200,
    expiresAt: "2026-10-31",
    status: "ativo",
  },
  {
    code: "DESCULPA15",
    title: "15% de compensação",
    description: "Um pedido de desculpas pelo atraso na sua entrega.",
    type: "percent",
    value: 15,
    minValue: 0,
    expiresAt: "2026-12-31",
    status: "ativo",
  },
  {
    code: "VERAO20",
    title: "20% em Moda Praia",
    description: "Campanha de verão encerrada.",
    type: "percent",
    value: 20,
    minValue: 0,
    expiresAt: "2026-03-01",
    status: "expirado",
  },
  {
    code: "ANIVER15",
    title: "15% de aniversário",
    description: "Presente de aniversário já utilizado.",
    type: "percent",
    value: 15,
    minValue: 0,
    expiresAt: "2026-09-30",
    status: "usado",
  },
];

export const addresses: Address[] = [
  {
    id: "a1",
    label: "Casa",
    recipient: "Karen Michelly",
    zip: "01310-100",
    street: "Avenida Paulista",
    number: "1578",
    complement: "Apto 142",
    district: "Bela Vista",
    city: "São Paulo",
    state: "SP",
    phone: "(11) 98765-4321",
    isDefault: true,
  },
  {
    id: "a2",
    label: "Trabalho",
    recipient: "Karen Michelly",
    zip: "04538-133",
    street: "Avenida Brigadeiro Faria Lima",
    number: "3477",
    complement: "14º andar",
    district: "Itaim Bibi",
    city: "São Paulo",
    state: "SP",
    phone: "(11) 3456-7890",
  },
];

export const orders: Order[] = [
  {
    id: "KM-240918",
    date: "2026-10-01",
    status: "transporte",
    items: [
      { productId: "p1", size: "P", color: "Champagne", qty: 1, price: 689.9 },
      { productId: "p9", size: "P", color: "Preto", qty: 1, price: 359.9 },
    ],
    shipping: 0,
    discount: 104.98,
    payment: "cartao",
    addressId: "a1",
    carrier: "Transportadora Expressa",
    tracking: "BR938475612KM",
    estimated: "2026-10-07",
  },
  {
    id: "KM-240877",
    date: "2026-09-22",
    status: "entregue",
    items: [{ productId: "p10", size: "M", color: "Pink", qty: 1, price: 349.9 }],
    shipping: 24.9,
    discount: 0,
    payment: "pix",
    addressId: "a1",
    carrier: "Correios SEDEX",
    tracking: "QB123456789BR",
    estimated: "2026-09-27",
  },
  {
    id: "KM-240850",
    date: "2026-09-29",
    status: "preparacao",
    items: [{ productId: "p5", size: "40", color: "Azul Marinho", qty: 1, price: 1290 }],
    shipping: 0,
    discount: 0,
    payment: "pix",
    addressId: "a2",
    carrier: "Transportadora Expressa",
    tracking: "",
    estimated: "2026-10-09",
  },
  {
    id: "KM-240712",
    date: "2026-09-05",
    status: "atrasado",
    items: [{ productId: "p6", size: "40", color: "Off-White", qty: 1, price: 1190 }],
    shipping: 0,
    discount: 150,
    payment: "cartao",
    addressId: "a1",
    carrier: "Correios PAC",
    tracking: "QB998877665BR",
    estimated: "2026-09-20",
  },
  {
    id: "KM-240650",
    date: "2026-08-18",
    status: "cancelado",
    items: [{ productId: "p4", size: "M", color: "Off-White", qty: 1, price: 489.9 }],
    shipping: 19.9,
    discount: 0,
    payment: "boleto",
    addressId: "a1",
    carrier: "Correios PAC",
    tracking: "",
    estimated: "2026-08-28",
  },
];

export const shippingOptions: ShippingOption[] = [
  { id: "economico", name: "Econômico", carrier: "Correios PAC", days: "6 a 9 dias úteis", price: 19.9 },
  { id: "expresso", name: "Expresso", carrier: "Correios SEDEX", days: "2 a 4 dias úteis", price: 34.9 },
  { id: "premium", name: "Entrega Premium", carrier: "Motoboy KM", days: "Em até 24h (capitais)", price: 49.9 },
  { id: "retirada", name: "Retirar no Atelier", carrier: "Loja Jardins, SP", days: "Pronto em 2h", price: 0 },
];

export const blogAuthors: BlogAuthor[] = [
  {
    slug: "karen-michelly",
    name: "Karen Michelly",
    role: "Fundadora & Diretora Criativa",
    bio: "Estilista com 15 anos de experiência em moda feminina, apaixonada por alfaiataria e por vestir mulheres reais com elegância.",
  },
  {
    slug: "marina-lopes",
    name: "Marina Lopes",
    role: "Editora de Moda",
    bio: "Jornalista de moda, escreve sobre tendências, consumo consciente e styling para o dia a dia.",
  },
];

export const blogCategories = [
  { slug: "tendencias", name: "Tendências" },
  { slug: "styling", name: "Styling" },
  { slug: "bastidores", name: "Bastidores" },
  { slug: "cuidados", name: "Cuidados com a peça" },
];

const sampleBody: BlogPost["body"] = [
  {
    type: "p",
    text: "A elegância não está no excesso, mas na intenção. Cada peça que escolhemos conta uma história sobre quem somos e sobre como queremos ocupar os espaços.",
  },
  { type: "h2", text: "Comece pelo essencial" },
  {
    type: "p",
    text: "Uma boa calça de alfaiataria, uma camisa de cetim e um blazer bem cortado formam a base de um guarda-roupa que funciona em qualquer estação.",
  },
  {
    type: "list",
    text: [
      "Invista em tecidos naturais e de toque agradável",
      "Prefira cores neutras que conversam entre si",
      "Use o dourado como ponto de luz, nunca como protagonista",
    ],
  },
  {
    type: "quote",
    text: "Vestir-se bem é uma forma silenciosa de cuidado consigo mesma.",
  },
  { type: "h2", text: "Os detalhes que assinam o look" },
  {
    type: "p",
    text: "Um cinto que marca a cintura, uma argola dourada, uma sandália de tiras finas. São os detalhes que transformam um visual simples em uma composição memorável.",
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "guarda-roupa-capsula-elegante",
    title: "Guarda-roupa cápsula: as peças que resolvem qualquer ocasião",
    excerpt: "Como montar uma base versátil que combina entre si e resolve todas as ocasiões.",
    category: "styling",
    author: "karen-michelly",
    date: "2026-09-28",
    readTime: 6,
    image: "/img/conjunto-alfaiataria-blazer-calca-off-white.webp",
    body: sampleBody,
  },
  {
    slug: "tendencias-primavera-verao-2027",
    title: "Primavera Verão 2027: o que vem por aí",
    excerpt: "Pantalonas fluidas, crochê artesanal e cores vibrantes. As apostas da estação.",
    category: "tendencias",
    author: "marina-lopes",
    date: "2026-09-20",
    readTime: 5,
    image: "/img/vestido-longo-camadas-laranja.webp",
    body: sampleBody,
  },
  {
    slug: "como-cuidar-do-cetim",
    title: "Como cuidar das suas peças de cetim",
    excerpt: "Lavagem, secagem e armazenamento para que o seu cetim dure por anos.",
    category: "cuidados",
    author: "marina-lopes",
    date: "2026-09-08",
    readTime: 4,
    image: "/img/vestido-midi-cetim-fenda-champagne.webp",
    body: sampleBody,
  },
  {
    slug: "bastidores-colecao-aurora",
    title: "Bastidores da coleção Aurora",
    excerpt: "Do primeiro croqui à última prova: uma visita ao nosso ateliê.",
    category: "bastidores",
    author: "karen-michelly",
    date: "2026-08-30",
    readTime: 7,
    image: "/img/conjunto-croche-kimono-short-off-white.webp",
    body: sampleBody,
  },
  {
    slug: "looks-de-festa-noite",
    title: "Cetim e corset: looks de festa para noites inesquecíveis",
    excerpt: "Do casamento ao jantar de gala, vestidos midi para brilhar com sofisticação.",
    category: "styling",
    author: "karen-michelly",
    date: "2026-08-15",
    readTime: 5,
    image: "/img/vestido-midi-corset-fenda-preto.webp",
    body: sampleBody,
  },
  {
    slug: "conjunto-pantalona-como-usar",
    title: "Conjunto de pantalona: cinco jeitos de usar",
    excerpt: "Da praia ao jantar, como transformar o mesmo conjunto em looks diferentes.",
    category: "tendencias",
    author: "marina-lopes",
    date: "2026-08-02",
    readTime: 3,
    image: "/img/conjunto-top-amarracao-calca-pantalona-pink.webp",
    body: sampleBody,
  },
];

export const faqs = [
  {
    group: "Pedidos",
    items: [
      {
        q: "Como acompanho o meu pedido?",
        a: "Acesse Minha Conta > Meus Pedidos e clique em Rastrear. Você também recebe atualizações por e-mail e WhatsApp.",
      },
      {
        q: "Posso alterar o endereço após a compra?",
        a: "Sim, enquanto o pedido estiver em preparação. Fale com o nosso atendimento pelo WhatsApp.",
      },
    ],
  },
  {
    group: "Pagamentos",
    items: [
      {
        q: "Quais formas de pagamento são aceitas?",
        a: "Cartões de crédito em até 6x sem juros, PIX com 5% de desconto e boleto bancário.",
      },
      {
        q: "O pagamento via PIX é seguro?",
        a: "Sim. O QR Code é gerado pelo nosso parceiro de pagamentos e a confirmação é instantânea.",
      },
    ],
  },
  {
    group: "Trocas e devoluções",
    items: [
      {
        q: "Qual o prazo para troca?",
        a: "Você tem até 30 dias após o recebimento para solicitar a troca, e a primeira troca é gratuita.",
      },
      {
        q: "Como funciona o reembolso?",
        a: "Após recebermos e analisarmos a peça, o reembolso é feito na mesma forma de pagamento em até 10 dias úteis.",
      },
    ],
  },
  {
    group: "Produtos",
    items: [
      {
        q: "Como escolher o tamanho ideal?",
        a: "Cada produto possui uma tabela de medidas. Em caso de dúvida, nossa consultora de estilo ajuda pelo WhatsApp.",
      },
    ],
  },
];

export const stores = [
  { city: "São Paulo", name: "Atelier Jardins", address: "Rua Oscar Freire, 1020", hours: "Seg a Sáb, 10h às 20h" },
  { city: "Rio de Janeiro", name: "Leblon", address: "Rua Dias Ferreira, 300", hours: "Seg a Sáb, 10h às 20h" },
];

/* Helpers ---------------------------------------------------------- */
export const getProduct = (idOrSlug: string) =>
  products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getBrand = (slug: string) => brands.find((b) => b.slug === slug);
export const getOrder = (id: string) => orders.find((o) => o.id === id);
export const getAddress = (id: string) => addresses.find((a) => a.id === id);
export const getPost = (slug: string) => blogPosts.find((p) => p.slug === slug);
export const getAuthor = (slug: string) => blogAuthors.find((a) => a.slug === slug);
export const discountPercent = (p: Product) =>
  p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
export const relatedProducts = (p: Product, n = 4) =>
  products.filter((x) => x.id !== p.id && x.category === p.category).slice(0, n);
export const similarProducts = (p: Product, n = 4) =>
  products
    .filter((x) => x.id !== p.id && (x.art === p.art || x.brand === p.brand))
    .slice(0, n);
export const onSale = () => products.filter((p) => p.oldPrice);
export const newArrivals = () =>
  [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 12);
export const bestsellers = () => [...products].sort((a, b) => b.sold - a.sold).slice(0, 12);
export const searchProducts = (q: string) => {
  const t = q
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
  if (!t) return [];
  return products.filter((p) =>
    `${p.name} ${p.category} ${p.subcategory} ${p.brand} ${p.colors.map((c) => c.name).join(" ")}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .includes(t)
  );
};
export const popularSearches = ["vestido longo", "pantalona", "cetim", "alfaiataria", "crochê", "macacão"];
