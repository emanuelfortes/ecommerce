import type { Order, OrderStatus, Product } from "@/lib/types";
import { getAddress, getProduct } from "@/lib/data";
import { formatDate } from "@/lib/format";

/** Data de referência da demonstração (evita divergência entre servidor e navegador). */
export const DEMO_TODAY = "2026-10-04";

export type TimelineItem = {
  title: string;
  text?: string;
  date?: string;
  state: "done" | "current" | "todo" | "error";
};

export const paymentLabel: Record<Order["payment"], string> = {
  pix: "PIX",
  cartao: "Cartão de crédito",
  boleto: "Boleto bancário",
};

export const paymentDetail: Record<Order["payment"], string> = {
  pix: "Pago à vista com 5% de desconto",
  cartao: "Visa final 4821 · 3x sem juros",
  boleto: "Boleto com vencimento em 3 dias úteis",
};

export function addDays(iso: string, n: number) {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + n);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export const shortDate = (iso: string) =>
  formatDate(iso, { day: "2-digit", month: "short" }).replace(".", "");

export function orderLines(o: Order) {
  return o.items
    .map((i) => ({ ...i, product: getProduct(i.productId) }))
    .filter((i): i is typeof i & { product: Product } => Boolean(i.product));
}

export const orderSubtotal = (o: Order) => o.items.reduce((s, i) => s + i.price * i.qty, 0);
export const orderTotal = (o: Order) => orderSubtotal(o) + o.shipping - o.discount;
export const orderCount = (o: Order) => o.items.reduce((s, i) => s + i.qty, 0);
export const orderAddress = (o: Order) => getAddress(o.addressId);

export type OrderGroup = "andamento" | "entregue" | "cancelado";
export function orderGroup(s: OrderStatus): OrderGroup {
  if (s === "entregue") return "entregue";
  if (s === "cancelado") return "cancelado";
  return "andamento";
}

export const canCancel = (s: OrderStatus) => s === "preparacao" || s === "aguardando";

export const progressSteps = [
  "Pedido realizado",
  "Pagamento aprovado",
  "Em preparação",
  "Enviado",
  "Em transporte",
  "Entregue",
];

const stepIndex: Record<OrderStatus, number> = {
  aguardando: 1,
  aprovado: 2,
  preparacao: 2,
  enviado: 3,
  transporte: 4,
  atrasado: 4,
  entregue: 5,
  cancelado: 0,
};

/** Índice da etapa em que o pedido se encontra (0 a 5). */
export const progressIndex = (s: OrderStatus) => stepIndex[s];

const stepOffsets = [0, 0, 1, 2, 3];
export const stepDate = (o: Order, i: number) => (i >= 5 ? o.estimated : addDays(o.date, stepOffsets[i]));

/** Nova previsão para pedidos atrasados. */
export const delayedEstimate = (o: Order) => addDays(o.estimated > DEMO_TODAY ? o.estimated : DEMO_TODAY, 4);

const stepTexts = [
  "Recebemos o seu pedido.",
  "Pagamento confirmado pela operadora.",
  "Suas peças estão sendo revisadas, passadas e embaladas no Atelier.",
  "O pacote foi entregue à transportadora.",
  "A caminho do endereço de entrega.",
  "Pedido entregue. Aproveite suas peças.",
];

/** Linha do tempo de status do pedido (vertical). */
export function statusTimeline(o: Order): TimelineItem[] {
  if (o.status === "cancelado") {
    return [
      { title: "Pedido realizado", text: stepTexts[0], date: formatDate(o.date), state: "done" },
      {
        title: "Pagamento não identificado",
        text: "O prazo de pagamento terminou sem confirmação.",
        date: formatDate(addDays(o.date, 3)),
        state: "error",
      },
      {
        title: "Pedido cancelado",
        text: "Nenhum valor foi cobrado e as peças voltaram ao estoque.",
        date: formatDate(addDays(o.date, 3)),
        state: "error",
      },
    ];
  }
  const idx = progressIndex(o.status);
  const delivered = o.status === "entregue";
  return progressSteps.map((title, i) => {
    let state: TimelineItem["state"] = i < idx ? "done" : i === idx ? (delivered ? "done" : "current") : "todo";
    let text = stepTexts[i];
    if (o.status === "atrasado" && i === idx) {
      state = "error";
      text = "Houve um atraso no centro de distribuição da transportadora.";
    }
    if (o.status === "aguardando" && i === idx) text = "Aguardando a confirmação do pagamento.";
    let date: string | undefined;
    if (i < idx || (i === idx && delivered)) date = formatDate(stepDate(o, i));
    else if (i === idx) date = "Agora";
    else if (i === 5) date = `Previsão: ${formatDate(o.status === "atrasado" ? delayedEstimate(o) : o.estimated)}`;
    return { title, text: i <= idx ? text : undefined, date, state };
  });
}

/** Eventos de rastreamento da transportadora, em ordem cronológica. */
export function trackingEvents(o: Order): TimelineItem[] {
  const idx = progressIndex(o.status);
  const all: { step: number; title: string; text: string; day: number | "est"; hour: string }[] = [
    { step: 0, title: "Pedido recebido", text: "Atelier Karen Michelly · São Paulo, SP", day: 0, hour: "14h32" },
    { step: 1, title: "Pagamento aprovado", text: paymentLabel[o.payment], day: 0, hour: "14h40" },
    { step: 2, title: "Em separação no Atelier", text: "Peças revisadas, passadas e embaladas", day: 1, hour: "09h15" },
    { step: 3, title: "Objeto postado", text: `Coletado por ${o.carrier} · Barueri, SP`, day: 2, hour: "17h05" },
    { step: 4, title: "Em trânsito", text: "Do centro de distribuição de Cajamar, SP para a unidade de destino", day: 3, hour: "06h48" },
    { step: 5, title: "Saiu para entrega", text: "O entregador está a caminho do seu endereço", day: "est", hour: "08h20" },
    { step: 5, title: "Entregue", text: "Recebido no endereço de entrega", day: "est", hour: "11h30" },
  ];
  const items: TimelineItem[] = [];
  for (const ev of all) {
    if (ev.step > idx) continue;
    const iso = ev.day === "est" ? o.estimated : addDays(o.date, ev.day);
    const waiting = o.status === "aguardando" && ev.step === 1;
    items.push({
      title: waiting ? "Aguardando pagamento" : ev.title,
      text: waiting ? "Assim que o pagamento for confirmado, iniciamos a preparação." : ev.text,
      date: `${shortDate(iso)} · ${ev.hour}`,
      state: "done",
    });
  }
  if (o.status === "atrasado") {
    items.push({
      title: "Atraso na entrega",
      text: "Volume acima do normal no centro de distribuição. Seu pacote segue em segurança.",
      date: `${shortDate(addDays(o.date, 5))} · 10h12`,
      state: "error",
    });
  } else if (o.status !== "entregue" && items.length) {
    items[items.length - 1].state = "current";
  }
  if (o.status !== "entregue") {
    const est = o.status === "atrasado" ? delayedEstimate(o) : o.estimated;
    items.push({ title: "Entrega prevista", text: "Você será avisada assim que sair para entrega.", date: formatDate(est), state: "todo" });
  }
  return items;
}

/** Fração do trajeto percorrido (0 a 1) para a ilustração de rota. */
export function routeProgress(s: OrderStatus) {
  const idx = progressIndex(s);
  if (s === "entregue") return 1;
  if (s === "atrasado") return 0.55;
  if (idx >= 4) return 0.62;
  if (idx === 3) return 0.18;
  return 0;
}

/** Protocolos de troca e devolução derivados do número do pedido. */
export const protocolFor = (o: Order, kind: "troca" | "devolucao") =>
  `${kind === "troca" ? "TR" : "DV"}-${o.id.replace(/\D/g, "")}`;

export const returnReasons = [
  { id: "tamanho", label: "Tamanho não serviu", text: "A modelagem ficou grande ou pequena." },
  { id: "cor", label: "A cor é diferente do esperado", text: "O tom pessoalmente não agradou." },
  { id: "gosto", label: "Não gostei do caimento", text: "A peça não valorizou como imaginei." },
  { id: "defeito", label: "Produto com defeito", text: "Costura, tecido ou aviamento com problema." },
  { id: "errado", label: "Recebi um item diferente", text: "Modelo, cor ou tamanho trocados." },
  { id: "outro", label: "Outro motivo", text: "Conte para nós nos comentários." },
];

export const cancelReasons = [
  { id: "desisti", label: "Desisti da compra" },
  { id: "prazo", label: "O prazo de entrega ficou longo" },
  { id: "endereco", label: "Preciso alterar o endereço" },
  { id: "pagamento", label: "Quero mudar a forma de pagamento" },
  { id: "outro-lugar", label: "Encontrei em outro lugar" },
  { id: "outro", label: "Outro motivo" },
];
