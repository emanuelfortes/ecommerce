export interface NavItem {
  label: string;
  href: string;
  mega?: string; // slug da categoria para abrir o mega menu
  highlight?: boolean;
}

export const mainNav: NavItem[] = [
  { label: "Novidades", href: "/novidades" },
  { label: "Vestidos", href: "/categoria/vestidos", mega: "vestidos" },
  { label: "Conjuntos", href: "/categoria/conjuntos", mega: "conjuntos" },
  { label: "Alfaiataria", href: "/categoria/alfaiataria", mega: "alfaiataria" },
  { label: "Macacões", href: "/categoria/macacoes", mega: "macacoes" },
  { label: "Mais Vendidos", href: "/mais-vendidos" },
  { label: "Ofertas", href: "/ofertas", highlight: true },
];

export const footerNav = [
  {
    title: "Loja",
    links: [
      { label: "Novidades", href: "/novidades" },
      { label: "Mais vendidos", href: "/mais-vendidos" },
      { label: "Ofertas", href: "/ofertas" },
      { label: "Cupons", href: "/cupons" },
      { label: "Categorias", href: "/categorias" },
      { label: "Marcas", href: "/marcas" },
      { label: "Comparar produtos", href: "/comparar" },
    ],
  },
  {
    title: "Ajuda",
    links: [
      { label: "Central de ajuda (FAQ)", href: "/faq" },
      { label: "Contato", href: "/contato" },
      { label: "Rastrear pedido", href: "/conta/pedidos" },
      { label: "Trocas e devoluções", href: "/politica-de-troca-e-devolucao" },
      { label: "Política de entrega", href: "/politica-de-entrega" },
      { label: "Formas de pagamento", href: "/politica-de-pagamento" },
    ],
  },
  {
    title: "A Marca",
    links: [
      { label: "Sobre nós", href: "/sobre" },
      { label: "Blog", href: "/blog" },
      { label: "Coleção Aurora", href: "/campanha/aurora" },
      { label: "Acessibilidade", href: "/acessibilidade" },
      { label: "Mapa do site", href: "/mapa-do-site" },
    ],
  },
];

export const legalNav = [
  { label: "Privacidade", href: "/politica-de-privacidade" },
  { label: "Termos de uso", href: "/termos-de-uso" },
  { label: "LGPD", href: "/lgpd" },
];
