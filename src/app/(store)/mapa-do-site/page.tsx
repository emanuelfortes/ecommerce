import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/ui/Primitives";
import { SiteMapComponents } from "@/components/content/SiteMapComponents";

export const metadata: Metadata = {
  title: "Mapa do site",
  description: "Índice de todas as telas da loja Karen Michelly para revisão e QA.",
  robots: { index: false, follow: false },
};

type Screen = { n: number; name: string; href: string; note?: string };

const P = "/produto/vestido-midi-cetim-aurora";
const ORDER = "KM-240918";
const DELIVERED = "KM-240877";

const groups: { title: string; range: string; items: Screen[] }[] = [
  {
    title: "Loja · telas públicas",
    range: "1 a 22",
    items: [
      { n: 1, name: "Home", href: "/" },
      { n: 2, name: "Busca de produtos", href: "/busca" },
      { n: 3, name: "Resultados da busca", href: "/busca?q=vestido" },
      { n: 4, name: "Categorias", href: "/categorias", note: "Listagem em /categoria/vestidos" },
      { n: 5, name: "Subcategoria", href: "/categoria/vestidos/midi" },
      { n: 6, name: "Listagem de produtos", href: "/produtos" },
      { n: 7, name: "Filtros de produtos", href: "/produtos", note: "Painel lateral e botão Filtrar no mobile" },
      { n: 8, name: "Ordenação de produtos", href: "/produtos", note: "Seletor Ordenar por" },
      { n: 9, name: "Página de produto", href: P },
      { n: 10, name: "Galeria de imagens do produto", href: `${P}#galeria` },
      { n: 11, name: "Avaliações do produto", href: `${P}#avaliacoes` },
      { n: 12, name: "Perguntas e respostas do produto", href: `${P}#perguntas` },
      { n: 13, name: "Produtos relacionados", href: `${P}#relacionados` },
      { n: 14, name: "Produtos similares", href: `${P}#similares` },
      { n: 15, name: "Wishlist / Favoritos", href: "/favoritos" },
      { n: 16, name: "Comparação de produtos", href: "/comparar" },
      { n: 17, name: "Marcas", href: "/marcas" },
      { n: 18, name: "Página da marca", href: "/marcas/km-atelier" },
      { n: 19, name: "Ofertas / Promoções", href: "/ofertas" },
      { n: 20, name: "Cupons / Ofertas especiais", href: "/cupons" },
      { n: 21, name: "Novidades / Lançamentos", href: "/novidades" },
      { n: 22, name: "Mais vendidos", href: "/mais-vendidos" },
    ],
  },
  {
    title: "Compra",
    range: "23 a 42",
    items: [
      { n: 23, name: "Carrinho", href: "/carrinho" },
      { n: 24, name: "Carrinho vazio", href: "/carrinho", note: "Com a sacola vazia" },
      { n: 25, name: "Carrinho com produtos", href: "/carrinho", note: "Com itens na sacola" },
      { n: 26, name: "Identificação / Login no checkout", href: "/checkout/identificacao" },
      { n: 27, name: "Cadastro durante checkout", href: "/checkout/identificacao", note: "Aba Criar conta" },
      { n: 28, name: "Endereço de entrega", href: "/checkout/entrega" },
      { n: 29, name: "Seleção de endereço", href: "/checkout/entrega", note: "Endereços salvos" },
      { n: 30, name: "Seleção de frete", href: "/checkout/entrega", note: "Opções de envio" },
      { n: 31, name: "Resumo da compra", href: "/checkout/pagamento" },
      { n: 32, name: "Aplicação de cupom", href: "/checkout/pagamento" },
      { n: 33, name: "Pagamento", href: "/checkout/pagamento" },
      { n: 34, name: "Pagamento PIX", href: "/checkout/pagamento", note: "Selecione PIX" },
      { n: 35, name: "Pagamento cartão", href: "/checkout/pagamento", note: "Selecione Cartão" },
      { n: 36, name: "Pagamento boleto", href: "/checkout/pagamento", note: "Selecione Boleto" },
      { n: 37, name: "Processando pagamento", href: "/checkout/processando" },
      { n: 38, name: "Pagamento aprovado", href: "/checkout/aprovado" },
      { n: 39, name: "Pagamento recusado", href: "/checkout/recusado" },
      { n: 40, name: "Pagamento pendente", href: "/checkout/pendente" },
      { n: 41, name: "Pedido realizado", href: "/checkout/pedido-realizado" },
      { n: 42, name: "Pedido não concluído", href: "/checkout/nao-concluido" },
    ],
  },
  {
    title: "Conta da cliente",
    range: "43 a 66",
    items: [
      { n: 43, name: "Login", href: "/login" },
      { n: 44, name: "Cadastro", href: "/cadastro" },
      { n: 45, name: "Recuperar senha", href: "/recuperar-senha" },
      { n: 46, name: "Redefinir senha", href: "/redefinir-senha" },
      { n: 47, name: "Verificação de e-mail", href: "/verificar-email" },
      { n: 48, name: "Minha conta", href: "/conta" },
      { n: 49, name: "Meu perfil", href: "/conta/perfil" },
      { n: 50, name: "Editar perfil", href: "/conta/perfil/editar" },
      { n: 51, name: "Meus endereços", href: "/conta/enderecos" },
      { n: 52, name: "Adicionar endereço", href: "/conta/enderecos/novo" },
      { n: 53, name: "Editar endereço", href: "/conta/enderecos/a1/editar" },
      { n: 54, name: "Meus pedidos", href: "/conta/pedidos" },
      { n: 55, name: "Detalhes do pedido", href: `/conta/pedidos/${ORDER}` },
      { n: 56, name: "Rastreamento do pedido", href: `/conta/pedidos/${ORDER}/rastreamento` },
      { n: 57, name: "Cancelar pedido", href: "/conta/pedidos/KM-240850/cancelar" },
      { n: 58, name: "Solicitar troca", href: `/conta/pedidos/${DELIVERED}/troca` },
      { n: 59, name: "Solicitar devolução", href: `/conta/pedidos/${DELIVERED}/devolucao` },
      { n: 60, name: "Status da devolução", href: "/conta/devolucoes/DV-240877" },
      { n: 61, name: "Meus pagamentos", href: "/conta/pagamentos" },
      { n: 62, name: "Meus cupons", href: "/conta/cupons" },
      { n: 63, name: "Meus favoritos", href: "/conta/favoritos" },
      { n: 64, name: "Alterar senha", href: "/conta/senha" },
      { n: 65, name: "Preferências / notificações", href: "/conta/notificacoes" },
      { n: 66, name: "Sair da conta", href: "/conta/sair" },
    ],
  },
  {
    title: "Pós-compra",
    range: "67 a 77",
    items: [
      { n: 67, name: "Acompanhamento do pedido", href: `/acompanhamento/${ORDER}` },
      { n: 68, name: "Pedido em preparação", href: `/acompanhamento/${ORDER}?estado=preparacao` },
      { n: 69, name: "Pedido enviado", href: `/acompanhamento/${ORDER}?estado=enviado` },
      { n: 70, name: "Pedido em transporte", href: `/acompanhamento/${ORDER}?estado=transporte` },
      { n: 71, name: "Pedido entregue", href: `/acompanhamento/${ORDER}?estado=entregue` },
      { n: 72, name: "Pedido atrasado", href: `/acompanhamento/${ORDER}?estado=atrasado` },
      { n: 73, name: "Avaliar compra", href: `/avaliar/pedido/${DELIVERED}` },
      { n: 74, name: "Avaliar produto", href: "/avaliar/produto/vestido-midi-cetim-aurora" },
      { n: 75, name: "Solicitação de troca", href: "/troca" },
      { n: 76, name: "Solicitação de devolução", href: "/devolucao" },
      { n: 77, name: "Reembolso", href: `/reembolso/${DELIVERED}` },
    ],
  },
  {
    title: "Institucional",
    range: "78 a 87",
    items: [
      { n: 78, name: "Sobre nós", href: "/sobre" },
      { n: 79, name: "Contato", href: "/contato" },
      { n: 80, name: "FAQ", href: "/faq" },
      { n: 81, name: "Política de privacidade", href: "/politica-de-privacidade" },
      { n: 82, name: "Termos de uso", href: "/termos-de-uso" },
      { n: 83, name: "Política de troca e devolução", href: "/politica-de-troca-e-devolucao" },
      { n: 84, name: "Política de entrega", href: "/politica-de-entrega" },
      { n: 85, name: "Política de pagamento", href: "/politica-de-pagamento" },
      { n: 86, name: "LGPD", href: "/lgpd" },
      { n: 87, name: "Página de acessibilidade", href: "/acessibilidade" },
    ],
  },
  {
    title: "Conteúdo e SEO",
    range: "88 a 94",
    items: [
      { n: 88, name: "Blog", href: "/blog" },
      { n: 89, name: "Página do artigo", href: "/blog/guarda-roupa-capsula-elegante" },
      { n: 90, name: "Categorias do blog", href: "/blog/categoria/styling" },
      { n: 91, name: "Página de autor", href: "/blog/autor/karen-michelly" },
      { n: 92, name: "Landing page de campanha", href: "/campanha/aurora" },
      { n: 93, name: "Landing page de categoria", href: "/colecao/alfaiataria", note: "Também /colecao/festa" },
      { n: 94, name: "Landing page promocional", href: "/promo/semana-dourada" },
    ],
  },
  {
    title: "Estados",
    range: "95 a 110",
    items: [
      { n: 95, name: "404 · Página não encontrada", href: "/pagina-que-nao-existe" },
      { n: 96, name: "500 · Erro interno", href: "/erro-500" },
      { n: 97, name: "Sem resultados de busca", href: "/busca?q=xyzkm" },
      { n: 98, name: "Categoria sem produtos", href: "/categoria/macacoes/curtos", note: "Também /categoria/praia/saidas" },
      { n: 99, name: "Produto indisponível", href: "/produto/vestido-curto-tweed-chloe" },
      { n: 100, name: "Produto esgotado", href: "/produto/macacao-longo-crepe-lyon" },
      { n: 101, name: "Carrinho vazio", href: "/carrinho", note: "Com a sacola vazia" },
      { n: 102, name: "Wishlist vazia", href: "/favoritos", note: "Sem favoritos salvos" },
      { n: 103, name: "Pedidos vazios", href: "/conta/pedidos?vazio=1" },
      { n: 104, name: "Endereços vazios", href: "/conta/enderecos?vazio=1" },
      { n: 105, name: "Notificações vazias", href: "/conta/notificacoes?vazio=1" },
      { n: 106, name: "Erro de conexão", href: "/erro-de-conexao" },
      { n: 107, name: "Checkout expirado", href: "/checkout/expirado" },
      { n: 108, name: "Sessão expirada", href: "/sessao-expirada" },
      { n: 109, name: "Loading / Skeleton", href: "/carregando" },
      { n: 110, name: "Manutenção", href: "/manutencao" },
    ],
  },
];

const total = groups.reduce((n, g) => n + g.items.length, 0) + 16;

/** Mapa do site: índice de QA com as 126 telas. */
export default function SiteMapPage() {
  return (
    <>
      <PageHeader
        eyebrow="Índice de QA"
        title="Mapa do site"
        text={`Todas as ${total} telas do projeto, agrupadas como no briefing. Clique para abrir cada rota ou acionar os componentes globais.`}
        crumbs={[{ label: "Mapa do site" }]}
      >
        <nav aria-label="Grupos" className="mt-6 flex flex-wrap gap-2">
          {[...groups.map((g) => ({ t: g.title, r: g.range })), { t: "Componentes de navegação", r: "111 a 126" }].map((g, i) => (
            <a
              key={g.t}
              href={`#grupo-${i + 1}`}
              className="border border-line bg-white px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-graphite transition-colors hover:border-ink"
            >
              {g.t} <span className="ml-1 text-taupe">{g.r}</span>
            </a>
          ))}
        </nav>
      </PageHeader>

      <div className="bg-offwhite py-14 md:py-20">
        <div className="container-km flex flex-col gap-16">
          {groups.map((g, gi) => (
            <section key={g.title} id={`grupo-${gi + 1}`} className="scroll-mt-32">
              <header className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <span className="eyebrow">Telas {g.range}</span>
                  <h2 className="mt-2 text-4xl">{g.title}</h2>
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-taupe">{g.items.length} telas</span>
              </header>
              <ul className="grid grid-cols-1 border-l border-t border-line bg-white sm:grid-cols-2 lg:grid-cols-3">
                {g.items.map((s) => (
                  <li key={s.n} className="min-w-0 border-b border-r border-line">
                    <Link href={s.href} className="group flex h-full items-start gap-4 p-4 transition-colors hover:bg-offwhite md:px-5">
                      <span className="w-10 shrink-0 font-serif text-2xl tabular-nums leading-none text-gold">{s.n}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] text-ink group-hover:text-gold">{s.name}</span>
                        <span className="mt-1 block truncate font-mono text-[11px] text-taupe">{s.href}</span>
                        {s.note && <span className="mt-1 block text-xs text-taupe/90">{s.note}</span>}
                      </span>
                      <ArrowUpRight className="size-4 shrink-0 text-taupe transition-colors group-hover:text-gold" strokeWidth={1.3} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section id={`grupo-${groups.length + 1}`} className="scroll-mt-32">
            <header className="mb-6 flex items-end justify-between gap-4">
              <div>
                <span className="eyebrow">Telas 111 a 126</span>
                <h2 className="mt-2 text-4xl">Componentes de navegação</h2>
                <p className="mt-2 text-sm text-taupe">Camadas globais montadas no layout raiz. Use os botões para acioná-las.</p>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-taupe">16 telas</span>
            </header>
            <SiteMapComponents />
          </section>
        </div>
      </div>
    </>
  );
}
