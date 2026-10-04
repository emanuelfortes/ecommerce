# Karen Michelly · Woman Wear

Frontend completo de e-commerce de moda feminina, com as 126 telas e estados do briefing.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · AOS · lucide-react

## Como rodar

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção
npm start
npm run lint       # checagem de tipos (tsc)
```

Requer Node.js 20 ou superior.

Comece por **`/mapa-do-site`**: é um índice com as 126 telas numeradas como no briefing, com link para cada rota e botões que abrem os componentes globais (menus, drawers, modais, toasts, cookies).

## Identidade visual

| Token Tailwind | Cor | Uso |
|---|---|---|
| `ink` | #0D0D0D | Primária, header, footer, botão principal |
| `offwhite` | #F7F4EF | Fundo principal |
| `nude` | #E8D8D2 | Seções de destaque |
| `champagne` | #D8C3A5 | Hover de cards, detalhes |
| `gold` | #C6A15B | Somente detalhe (fios, ícones, hover) |
| `graphite` | #24211F | Texto principal |
| `taupe` | #9B8B7A | Texto secundário |

Tipografia: Cormorant Garamond (títulos) e Jost (texto), servidas localmente via `@fontsource`.

O logotipo enviado foi tratado e está em `public/brand/`:
`karen-michelly-logo.jpg` (original), `karen-michelly-logo.webp` (fundo transparente) e `km-monogram.png` (monograma usado no header e no favicon).

## Animações

Apenas **duas** animações AOS em todo o projeto, repetidas sempre que o elemento entra na tela (`once: false`, `mirror: true`):

- `fade-up`
- `zoom-in` (suavizado no CSS)

Use o helper: `import { aos } from "@/lib/aos"` e depois `<div {...aos.fadeUp(100)}>` ou `<div {...aos.zoomIn()}>`.
Quem ativa "reduzir movimento" no sistema vê o conteúdo sem animação.

## Imagens dos produtos

Como não havia fotos, os produtos usam ilustrações editoriais em SVG geradas por código (`ProductArt`), com 4 vistas por peça.
Para usar fotos reais, preencha `images: ["https://..."]` no produto em `src/lib/data.ts`. O componente `ProductImage` passa a exibir as fotos automaticamente.
Se usar um CDN externo, adicione o domínio em `next.config.ts`.

## Estrutura

```
src/app/(store)/        Páginas da loja (com header e footer)
src/app/(checkout)/     Checkout com layout enxuto
src/app/(standalone)/   Manutenção (tela cheia)
src/app/not-found.tsx   404 global
src/components/         ui · product · checkout · account · orders · content · overlays · layout · providers
src/lib/data.ts         Dados de demonstração (troque pela sua API)
docs/GUIA-DE-DESENVOLVIMENTO.md   Regras de design, componentes e mapa de rotas
```

Estado global (sacola, favoritos, comparação, usuária, CEP, moeda, idioma, cupom, consentimento de cookies) fica em `StoreProvider` e é salvo no navegador. Overlays e toasts ficam em `UIProvider`.

## Dados de demonstração úteis

- Cupons: `BEMVINDA10`, `KMFRETE`, `GOLD150`, `DESCULPA15` (ativos), `VERAO20` (expirado), `ANIVER15` (usado)
- Cartão terminado em `0000` simula pagamento recusado. Boleto leva a pagamento pendente. PIX leva a pedido realizado.
- Produto esgotado: `/produto/macacao-longo-crepe-lyon`. Indisponível: `/produto/vestido-curto-tweed-chloe`
- Categoria sem produtos: `/categoria/macacoes/curtos`
- Estados vazios da conta: adicione `?vazio=1` em `/conta/pedidos`, `/conta/enderecos` e `/conta/notificacoes`

## Próximos passos para produção

- Conectar `src/lib/data.ts` a uma API ou CMS (produtos, pedidos, autenticação)
- Integrar gateway de pagamento (PIX, cartão, boleto) e cálculo real de frete
- Internacionalização real (por exemplo, next-intl) para os idiomas do seletor
- Trocar as ilustrações por fotos dos produtos
