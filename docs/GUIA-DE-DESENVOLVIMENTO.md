# Guia de desenvolvimento · Karen Michelly

Stack: Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · AOS · lucide-react · clsx.

## Regras de design (obrigatórias)

- Paleta via tokens Tailwind (definidos em `src/app/globals.css`):
  `ink` #0D0D0D · `offwhite` #F7F4EF · `nude` #E8D8D2 · `champagne` #D8C3A5 · `gold` #C6A15B ·
  `graphite` #24211F (texto principal) · `taupe` #9B8B7A (texto secundário) · `white` · `line` (bordas) ·
  `success` · `danger` · `warning`.
- Preto e off-white dominam. Dourado SÓ como detalhe (fios, ícones pequenos, hover, badges de desconto).
- Tipografia: títulos `font-serif` (Cormorant Garamond, peso 300/400), corpo `font-sans` (Jost). Sobretítulos com a utility `eyebrow`.
- Botão principal: `<Button>` (preto, hover dourado). Secundário: `<Button variant="secondary">` (contorno preto, hover preto).
  Também `variant="gold"` (newsletter) e `variant="light"` (sobre fundo preto). `size="sm"`. Aceita `href` (vira Link).
- Cards de produto: fundo branco, hover champagne (já em `<ProductCard>`).
- Seção de destaque: fundo `bg-nude`, título `text-ink`, texto `text-graphite`, detalhes `gold`.
- Estilo: elegante, feminino, minimalista, muito respiro (py-20 / md:py-28 em seções), cantos retos, linhas finas.
- Ícones lucide com `strokeWidth={1.2}` ou `1.3`.
- NÃO usar travessão em nenhum texto (preferência da marca). Use ponto, vírgula ou "·".
- Todo texto em português do Brasil.

## Animações (AOS)

Somente DUAS animações no projeto inteiro, repetidas a cada entrada no viewport (`once: false`):
`fade-up` e `zoom-in`. Use sempre o helper: `import { aos } from "@/lib/aos"` →
`<div {...aos.fadeUp(100)}>` ou `<div {...aos.zoomIn()}>`. Funciona em Server e Client Components.
Não crie outras animações de scroll.

## Estrutura

```
src/app/layout.tsx                 Providers + overlays globais
src/app/(store)/layout.tsx         Header + Newsletter + Footer (todas as páginas da loja)
src/app/(checkout)/...             Checkout com layout enxuto
src/lib/data.ts                    Dados mock + helpers (getProduct, getCategory, searchProducts...)
src/lib/types.ts                   Tipos
src/lib/format.ts                  formatMoney, formatDate, installments, pixPrice
src/lib/aos.ts                     helper das 2 animações
src/components/providers/          StoreProvider (useStore) · UIProvider (useUI) · AosInit
src/components/ui/                 Button · Primitives (SectionHeading, PageHeader, Breadcrumbs, Rating, Badge, Ornament, Skeleton, orderStatusLabel)
                                   Overlay (Drawer, Modal) · Interactive (Accordion, Tabs, QuantityStepper, SizeSelector, ColorSelector)
                                   Form (Field, TextArea, Select, Checkbox, RadioCard, Toggle) · Feedback (EmptyState, Stepper, Timeline, Notice)
src/components/product/            ProductArt · ProductImage · ProductCard/ProductGrid/ProductCardSkeleton · ProductCarousel · ProductListing · Price/Money
src/components/checkout/Cart.tsx   CartLine · FreeShippingBar · CouponInput · OrderSummary
src/components/account/AuthForms   LoginForm · SignupForm
src/components/overlays/           Menu mobile, busca, drawers, modais, cookies, toasts (já montados globalmente)
src/components/shared/             Logo, SocialIcon, PostCard
```

### Hooks
- `useStore()`: cart, wishlist, compare, user, cep, currency, locale, coupon; ações addToCart, updateQty, removeFromCart, clearCart,
  toggleWishlist, isWished, toggleCompare, login, logout, applyCoupon, removeCoupon; `money(v)` formata na moeda escolhida;
  `subtotal`, `discount`, `cartCount`, `activeCoupon`, `hydrated` (true após ler o navegador; use para evitar flash de estado vazio).
- `useUI()`: `open({type:"cart"|"wishlist"|"search"|"menu"|"login"|"signup"|"cep"|"locale"|"coupon"})`,
  `open({type:"quickview", productId})`, `confirm({title, message, confirmLabel, tone, onConfirm})`,
  `toast(title, {message, variant: "success"|"error"|"info"})`, `close()`.

### Imagens
Não há fotos: `<ProductImage product={p} index={0..3} color="Preto" />` desenha a ilustração editorial
(index 0 frente, 1 detalhe, 2 costas, 3 editorial escuro). Para cenas genéricas use `<ProductArt kind="dress" tone={0..3} color="#hex" />`.
Quando houver fotos reais, basta preencher `images` no produto.

### Params (Next 16)
Em páginas dinâmicas `params` e `searchParams` são Promises:
`export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; }`
Use `notFound()` de `next/navigation` quando o item não existir. Exporte `generateStaticParams` quando fizer sentido e `metadata`/`generateMetadata`.
Componentes que usam hooks precisam de `"use client"` no topo do arquivo; mantenha páginas como Server Components quando possível
e extraia a parte interativa para um componente client.

## Mapa de rotas

| Telas | Rota |
|---|---|
| 1 | `/` |
| 2, 3, 97 | `/busca?q=` |
| 4 | `/categorias` e `/categoria/[slug]` |
| 5 | `/categoria/[slug]/[sub]` |
| 6, 7, 8 | `/produtos` |
| 9 a 14, 99, 100 | `/produto/[slug]` (esgotado: `macacao-longo-crepe-lyon`, indisponível: `vestido-curto-tweed-chloe`) |
| 15, 102 | `/favoritos` |
| 16 | `/comparar` |
| 17, 18 | `/marcas`, `/marcas/[slug]` |
| 19 a 22 | `/ofertas`, `/cupons`, `/novidades`, `/mais-vendidos` |
| 98 | `/categoria/macacoes/curtos`, `/categoria/praia/saidas` |
| 23, 24, 25, 101 | `/carrinho` |
| 26, 27 | `/checkout/identificacao` |
| 28, 29, 30 | `/checkout/entrega` |
| 31 a 36 | `/checkout/pagamento` |
| 37 a 42 | `/checkout/processando`, `/checkout/aprovado`, `/checkout/recusado`, `/checkout/pendente`, `/checkout/pedido-realizado`, `/checkout/nao-concluido` |
| 107 | `/checkout/expirado` |
| 43 a 47 | `/login`, `/cadastro`, `/recuperar-senha`, `/redefinir-senha`, `/verificar-email` |
| 48 a 66 | `/conta`, `/conta/perfil`, `/conta/perfil/editar`, `/conta/enderecos`, `/conta/enderecos/novo`, `/conta/enderecos/[id]/editar`, `/conta/pedidos`, `/conta/pedidos/[id]`, `/conta/pedidos/[id]/rastreamento`, `/conta/pedidos/[id]/cancelar`, `/conta/pedidos/[id]/troca`, `/conta/pedidos/[id]/devolucao`, `/conta/devolucoes/[id]`, `/conta/pagamentos`, `/conta/cupons`, `/conta/favoritos`, `/conta/senha`, `/conta/notificacoes`, `/conta/sair` |
| 103, 104, 105 | estados vazios dentro de `/conta/pedidos`, `/conta/enderecos`, `/conta/notificacoes` (`?vazio=1`) |
| 67 a 72 | `/acompanhamento/[id]` (estado real do pedido; `?estado=preparacao|enviado|transporte|entregue|atrasado`) |
| 73, 74 | `/avaliar/pedido/[id]`, `/avaliar/produto/[slug]` |
| 75, 76, 77 | `/troca`, `/devolucao`, `/reembolso/[id]` |
| 78 a 87 | `/sobre`, `/contato`, `/faq`, `/politica-de-privacidade`, `/termos-de-uso`, `/politica-de-troca-e-devolucao`, `/politica-de-entrega`, `/politica-de-pagamento`, `/lgpd`, `/acessibilidade` |
| 88 a 91 | `/blog`, `/blog/[slug]`, `/blog/categoria/[slug]`, `/blog/autor/[slug]` |
| 92, 93, 94 | `/campanha/[slug]` (aurora), `/colecao/[slug]` (alfaiataria, festa), `/promo/[slug]` (semana-dourada) |
| 95, 96 | `not-found.tsx` (global), `error.tsx` + `/erro-500` |
| 106, 108, 109, 110 | `/erro-de-conexao`, `/sessao-expirada`, `loading.tsx` + `/carregando`, `/manutencao` |
| 111 a 126 | Componentes globais. Demonstração em `/mapa-do-site` |
