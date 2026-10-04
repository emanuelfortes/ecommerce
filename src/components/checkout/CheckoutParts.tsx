"use client";

import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { Check, Copy, CreditCard, Lock, RefreshCcw, ShieldCheck } from "lucide-react";
import { getProduct } from "@/lib/data";
import type { CartItem } from "@/lib/types";
import { useStore } from "@/components/providers/StoreProvider";
import { useUI } from "@/components/providers/UIProvider";
import { ProductImage } from "@/components/product/ProductImage";

/* =========================================================
   Máscaras e validações
   ========================================================= */
export const onlyDigits = (v: string) => v.replace(/\D/g, "");

export function maskCep(v: string) {
  const d = onlyDigits(v).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

export function maskPhone(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function maskExpiry(v: string) {
  const d = onlyDigits(v).slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

export type CardBrand = "visa" | "mastercard" | "amex" | "elo" | "hipercard" | null;

export const brandLabel: Record<NonNullable<CardBrand>, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  elo: "Elo",
  hipercard: "Hipercard",
};

export function detectBrand(num: string): CardBrand {
  const d = onlyDigits(num);
  if (!d) return null;
  if (/^(4011|4312|4389|4514|4576|5041|5066|5067|509|6277|6362|6363|650|6516|6550)/.test(d)) return "elo";
  if (/^606282|^3841/.test(d)) return "hipercard";
  if (/^3[47]/.test(d)) return "amex";
  if (/^4/.test(d)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(d)) return "mastercard";
  return null;
}

export function maskCard(v: string) {
  const brand = detectBrand(v);
  if (brand === "amex") {
    const d = onlyDigits(v).slice(0, 15);
    return [d.slice(0, 4), d.slice(4, 10), d.slice(10)].filter(Boolean).join(" ");
  }
  const d = onlyDigits(v).slice(0, 16);
  return d.replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function expiryValid(v: string, now = new Date()) {
  const m = /^(\d{2})\/(\d{2})$/.exec(v);
  if (!m) return false;
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return false;
  const y = now.getFullYear();
  return year > y || (year === y && month >= now.getMonth() + 1);
}

/* =========================================================
   Simulação de consulta de CEP
   ========================================================= */
const knownCeps: Record<string, { street: string; district: string; city: string; state: string }> = {
  "01310100": { street: "Avenida Paulista", district: "Bela Vista", city: "São Paulo", state: "SP" },
  "04538133": { street: "Avenida Brigadeiro Faria Lima", district: "Itaim Bibi", city: "São Paulo", state: "SP" },
  "01426001": { street: "Rua Oscar Freire", district: "Jardins", city: "São Paulo", state: "SP" },
  "22071000": { street: "Avenida Atlântica", district: "Copacabana", city: "Rio de Janeiro", state: "RJ" },
};

const regions: { city: string; state: string; district: string }[] = [
  { city: "São Paulo", state: "SP", district: "Jardim Paulista" },
  { city: "Campinas", state: "SP", district: "Cambuí" },
  { city: "Rio de Janeiro", state: "RJ", district: "Leblon" },
  { city: "Belo Horizonte", state: "MG", district: "Savassi" },
  { city: "Salvador", state: "BA", district: "Barra" },
  { city: "Recife", state: "PE", district: "Boa Viagem" },
  { city: "Fortaleza", state: "CE", district: "Meireles" },
  { city: "Brasília", state: "DF", district: "Asa Sul" },
  { city: "Curitiba", state: "PR", district: "Batel" },
  { city: "Porto Alegre", state: "RS", district: "Moinhos de Vento" },
];

/** Simula uma API de CEP (ViaCEP etc.). "00000-000" retorna erro. */
export function lookupCep(cep: string): Promise<{ street: string; district: string; city: string; state: string } | null> {
  const d = onlyDigits(cep);
  return new Promise((resolve) =>
    window.setTimeout(() => {
      if (d.length !== 8 || /^0+$/.test(d)) return resolve(null);
      if (knownCeps[d]) return resolve(knownCeps[d]);
      const r = regions[Number(d[0])] ?? regions[0];
      resolve({ street: "Rua das Acácias", district: r.district, city: r.city, state: r.state });
    }, 650)
  );
}

export const ufs = "AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" ");

/* =========================================================
   Selos e bandeiras
   ========================================================= */
export function SecureBadges({ className }: { className?: string }) {
  const items = [
    { icon: Lock, title: "Pagamento seguro", text: "Criptografia SSL" },
    { icon: RefreshCcw, title: "Troca fácil", text: "Primeira troca grátis" },
    { icon: CreditCard, title: "6x sem juros", text: "Ou 5% off no PIX" },
  ];
  return (
    <ul className={clsx("grid gap-4", className)}>
      {items.map(({ icon: Icon, title, text }) => (
        <li key={title} className="flex items-center gap-3">
          <Icon className="size-4 shrink-0 text-gold" strokeWidth={1.2} />
          <span className="text-xs text-taupe">
            <span className="uppercase tracking-[0.16em] text-ink">{title}</span> · {text}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function PaymentBadges({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <div className={clsx("flex flex-wrap items-center gap-2", className)}>
      {["Visa", "Master", "Elo", "Amex", "PIX", "Boleto"].map((m) => (
        <span
          key={m}
          className={clsx(
            "border px-2.5 py-1 text-[10px] uppercase tracking-[0.14em]",
            dark ? "border-white/15 text-offwhite/70" : "border-line bg-white text-graphite/70"
          )}
        >
          {m}
        </span>
      ))}
    </div>
  );
}

export function SafeSeal() {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-taupe">
      <ShieldCheck className="size-4 text-gold" strokeWidth={1.2} /> Ambiente protegido
    </span>
  );
}

/* =========================================================
   Lista compacta de itens (resumo lateral e confirmação)
   ========================================================= */
export function ItemMiniList({ items, className }: { items: (CartItem & { price?: number })[]; className?: string }) {
  const { money } = useStore();
  return (
    <ul className={clsx("divide-y divide-line", className)}>
      {items.map((i) => {
        const p = getProduct(i.productId);
        if (!p) return null;
        return (
          <li key={i.key} className="flex items-center gap-4 py-4">
            <div className="relative w-14 shrink-0">
              <ProductImage product={p} color={i.color} />
              <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-ink text-[10px] text-white">
                {i.qty}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-[17px] leading-tight text-ink">{p.name}</p>
              <p className="mt-0.5 text-xs text-taupe">
                {i.color} · Tam. {i.size}
              </p>
            </div>
            <span className="text-sm tabular-nums text-graphite">{money((i.price ?? p.price) * i.qty)}</span>
          </li>
        );
      })}
    </ul>
  );
}

/* =========================================================
   Copiar para a área de transferência
   ========================================================= */
export function CopyField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  const { toast } = useUI();
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* navegadores sem permissão: o texto continua selecionável */
    }
    setDone(true);
    toast("Copiado", { message: `${label} copiado para a área de transferência.` });
    window.setTimeout(() => setDone(false), 2500);
  };
  return (
    <div>
      <span className="field-label">{label}</span>
      <div className="flex border border-line bg-white">
        <p className={clsx("min-w-0 flex-1 break-all px-4 py-3.5 text-[13px] text-graphite select-all", mono && "font-mono tracking-wide")}>
          {value}
        </p>
        <button
          type="button"
          onClick={copy}
          className="flex shrink-0 items-center gap-2 border-l border-line px-4 text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ink hover:text-white"
        >
          {done ? <Check className="size-4 text-gold" strokeWidth={1.4} /> : <Copy className="size-4" strokeWidth={1.2} />}
          <span className="hidden sm:inline">{done ? "Copiado" : "Copiar"}</span>
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   Contagem regressiva (PIX)
   ========================================================= */
export function useCountdown(target: number | null) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);
  const left = target && now ? Math.max(0, target - now) : null;
  const mm = left == null ? "--" : String(Math.floor(left / 60000)).padStart(2, "0");
  const ss = left == null ? "--" : String(Math.floor((left % 60000) / 1000)).padStart(2, "0");
  return { left, label: `${mm}:${ss}`, expired: left === 0 };
}

/* =========================================================
   QR Code ilustrativo (grade SVG determinística)
   ========================================================= */
export function QrCode({ seed, size = 25, className, faded }: { seed: string; size?: number; className?: string; faded?: boolean }) {
  const cells = useMemo(() => {
    let h = 2166136261;
    for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    const rand = () => {
      h ^= h << 13;
      h ^= h >>> 17;
      h ^= h << 5;
      return ((h >>> 0) % 1000) / 1000;
    };
    const finder = (x: number, y: number) =>
      (x < 8 && y < 8) || (x >= size - 8 && y < 8) || (x < 8 && y >= size - 8);
    const out: [number, number][] = [];
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) if (!finder(x, y) && rand() > 0.52) out.push([x, y]);
    return out;
  }, [seed, size]);

  const Finder = ({ x, y }: { x: number; y: number }) => (
    <g>
      <rect x={x} y={y} width={7} height={7} fill="currentColor" />
      <rect x={x + 1} y={y + 1} width={5} height={5} fill="#fff" />
      <rect x={x + 2} y={y + 2} width={3} height={3} fill="currentColor" />
    </g>
  );

  return (
    <svg
      viewBox={`-2 -2 ${size + 4} ${size + 4}`}
      role="img"
      aria-label="QR Code PIX ilustrativo"
      className={clsx("block bg-white text-ink", faded && "opacity-20", className)}
      shapeRendering="crispEdges"
    >
      <rect x={-2} y={-2} width={size + 4} height={size + 4} fill="#fff" />
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="currentColor" />
      ))}
      <Finder x={0} y={0} />
      <Finder x={size - 7} y={0} />
      <Finder x={0} y={size - 7} />
      <rect x={size / 2 - 2.5} y={size / 2 - 2.5} width={5} height={5} fill="#fff" />
      <rect x={size / 2 - 1.5} y={size / 2 - 1.5} width={3} height={3} fill="#C6A15B" transform={`rotate(45 ${size / 2} ${size / 2})`} />
    </svg>
  );
}

export function pixCode(orderId: string, total: number) {
  return `00020126580014BR.GOV.BCB.PIX0136karenmichelly-${orderId.toLowerCase()}52040000530398654${String(
    total.toFixed(2)
  ).padStart(7, "0")}5802BR5915KAREN MICHELLY6009SAO PAULO62070503***6304A1F3`;
}

export function boletoLine(orderId: string) {
  const n = onlyDigits(orderId).padEnd(6, "0");
  return `34191.79001 01043.51004 7${n.slice(0, 4)}1.${n.slice(4)}0000 1 9876000${n}`;
}

/* =========================================================
   Pré-visualização do cartão (preto com chip dourado)
   ========================================================= */
export function CardPreview({
  number,
  holder,
  expiry,
  brand,
  flipped,
}: {
  number: string;
  holder: string;
  expiry: string;
  brand: CardBrand;
  flipped?: boolean;
}) {
  const digits = onlyDigits(number);
  const shown = (brand === "amex" ? "•••• •••••• •••••" : "•••• •••• •••• ••••")
    .split("")
    .reduce<{ out: string; i: number }>(
      (acc, ch) => (ch === "•" ? { out: acc.out + (digits[acc.i] ?? "•"), i: acc.i + 1 } : { out: acc.out + ch, i: acc.i }),
      { out: "", i: 0 }
    ).out;

  return (
    <div className="mx-auto w-full max-w-[360px] [perspective:1200px]" aria-hidden>
      <div
        className={clsx(
          "relative aspect-[1.586] w-full transition-transform duration-700 ease-[var(--ease-luxe)] [transform-style:preserve-3d]",
          flipped && "[transform:rotateY(180deg)]"
        )}
      >
        {/* Frente */}
        <div className="absolute inset-0 flex flex-col justify-between overflow-hidden bg-ink p-6 text-offwhite shadow-2xl [backface-visibility:hidden]">
          <span className="pointer-events-none absolute -right-16 -top-16 size-52 rounded-full border border-gold/25" />
          <span className="pointer-events-none absolute -bottom-24 -left-10 size-56 rounded-full border border-white/5" />
          <div className="relative flex items-start justify-between">
            <span className="font-serif text-sm uppercase tracking-[0.3em] text-gold">KM</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-champagne">
              {brand ? brandLabel[brand] : "Cartão"}
            </span>
          </div>
          <div className="relative">
            <span className="mb-4 block h-7 w-10 rounded-[4px] bg-linear-to-br from-champagne via-gold to-[#9c7a3c] shadow-inner">
              <span className="mx-auto mt-[9px] block h-px w-6 bg-ink/30" />
              <span className="mx-auto mt-[5px] block h-px w-6 bg-ink/30" />
            </span>
            <p className="font-mono text-[17px] tracking-[0.12em] text-white sm:text-lg">{shown}</p>
          </div>
          <div className="relative flex items-end justify-between gap-4 text-[10px] uppercase tracking-[0.18em]">
            <div className="min-w-0">
              <p className="text-taupe">Titular</p>
              <p className="mt-1 truncate text-[12px] text-offwhite">{holder || "Nome impresso"}</p>
            </div>
            <div className="text-right">
              <p className="text-taupe">Validade</p>
              <p className="mt-1 text-[12px] text-offwhite">{expiry || "MM/AA"}</p>
            </div>
          </div>
        </div>
        {/* Verso */}
        <div className="absolute inset-0 overflow-hidden bg-ink text-offwhite shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className="mt-6 block h-10 w-full bg-graphite" />
          <div className="mx-6 mt-5 flex items-center gap-3">
            <span className="h-8 flex-1 bg-offwhite/90" />
            <span className="grid h-8 w-14 place-items-center border border-gold/60 font-mono text-sm text-gold">•••</span>
          </div>
          <p className="mx-6 mt-4 text-[10px] uppercase tracking-[0.18em] text-taupe">Código de segurança</p>
        </div>
      </div>
    </div>
  );
}
