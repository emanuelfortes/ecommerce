"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { addresses as savedAddresses, getProduct, orders, shippingOptions } from "@/lib/data";
import type { Address, CartItem, Coupon, ShippingOption } from "@/lib/types";
import { FREE_SHIPPING } from "@/components/checkout/Cart";

/** Tempo máximo de uma sessão de checkout (tela 107). */
export const CHECKOUT_TTL = 30 * 60 * 1000;

export type PaymentMethod = "pix" | "cartao" | "boleto";
export type CheckoutOutcome = "aprovado" | "recusado" | "pendente" | "pedido-realizado";

/** Dados do cartão já mascarados: nunca guardamos número completo nem CVV. */
export interface MaskedCard {
  brand: string;
  last4: string;
  holder: string;
  installments: number;
}

export interface OrderSnapshot {
  items: (CartItem & { price: number })[];
  subtotal: number;
  discount: number;
  couponCode: string | null;
  shipping: number;
  pixDiscount: number;
  total: number;
  createdAt: number;
}

export interface CheckoutData {
  email: string;
  guest: boolean;
  addressId: string | null;
  customAddresses: Address[];
  shippingId: string | null;
  gift: boolean;
  giftMessage: string;
  payment: PaymentMethod | null;
  card: MaskedCard | null;
  outcome: CheckoutOutcome | null;
  orderId: string | null;
  order: OrderSnapshot | null;
  startedAt: number | null;
}

const initial: CheckoutData = {
  email: "",
  guest: false,
  addressId: null,
  customAddresses: [],
  shippingId: null,
  gift: false,
  giftMessage: "",
  payment: null,
  card: null,
  outcome: null,
  orderId: null,
  order: null,
  startedAt: null,
};

const STORAGE_KEY = "km-checkout-v1";

interface CheckoutContext {
  data: CheckoutData;
  hydrated: boolean;
  update: (p: Partial<CheckoutData> | ((d: CheckoutData) => Partial<CheckoutData>)) => void;
  /** Inicia o relógio da sessão, se ainda não houver um. */
  start: () => void;
  reset: () => void;
  isExpired: () => boolean;
  addressList: (loggedIn: boolean) => Address[];
  address: Address | null;
  shipping: ShippingOption | null;
}

const Ctx = createContext<CheckoutContext | null>(null);

export function CheckoutStateProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CheckoutData>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) setData({ ...initial, ...JSON.parse(raw) });
    } catch {
      /* sessionStorage indisponível: segue em memória */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* ignora */
    }
  }, [data, hydrated]);

  const update = useCallback<CheckoutContext["update"]>(
    (p) => setData((d) => ({ ...d, ...(typeof p === "function" ? p(d) : p) })),
    []
  );

  const start = useCallback(() => setData((d) => (d.startedAt ? d : { ...d, startedAt: Date.now() })), []);
  const reset = useCallback(() => setData(initial), []);
  const isExpired = useCallback(
    () => data.startedAt !== null && Date.now() - data.startedAt > CHECKOUT_TTL,
    [data.startedAt]
  );

  const addressList = useCallback(
    (loggedIn: boolean) => [...(loggedIn ? savedAddresses : []), ...data.customAddresses],
    [data.customAddresses]
  );

  const address = useMemo(
    () => [...savedAddresses, ...data.customAddresses].find((a) => a.id === data.addressId) ?? null,
    [data.addressId, data.customAddresses]
  );
  const shipping = useMemo(() => shippingOptions.find((s) => s.id === data.shippingId) ?? null, [data.shippingId]);

  return (
    <Ctx.Provider value={{ data, hydrated, update, start, reset, isExpired, addressList, address, shipping }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCheckout deve ser usado dentro de <CheckoutStateProvider>");
  return ctx;
}

/** Mesma regra do <OrderSummary>: frete grátis acima de R$ 399 ou com cupom de frete. */
export function computeTotals(subtotal: number, discount: number, coupon: Coupon | null, shippingPrice: number | null) {
  const freeByCoupon = coupon?.type === "shipping" && subtotal >= coupon.minValue;
  const ship = shippingPrice == null ? null : subtotal >= FREE_SHIPPING || freeByCoupon ? 0 : shippingPrice;
  const total = Math.max(0, subtotal - discount + (ship ?? 0));
  return { ship, total, freeShipping: subtotal >= FREE_SHIPPING || !!freeByCoupon };
}

export function newOrderId() {
  return `KM-${String(241000 + Math.floor(Math.random() * 8999)).padStart(6, "0")}`;
}

/** Pedido de demonstração usado quando a tela é aberta diretamente (sem compra na sessão). */
export function demoSnapshot(): OrderSnapshot {
  const o = orders[0];
  const subtotal = o.items.reduce((s, i) => s + i.price * i.qty, 0);
  return {
    items: o.items.map((i) => ({ key: `${i.productId}-${i.size}-${i.color}`, ...i })),
    subtotal,
    discount: o.discount,
    couponCode: o.discount ? "BEMVINDA10" : null,
    shipping: o.shipping,
    pixDiscount: 0,
    total: subtotal - o.discount + o.shipping,
    createdAt: Date.now(),
  };
}

export function snapshotItems(cart: CartItem[]) {
  return cart.map((i) => ({ ...i, price: getProduct(i.productId)?.price ?? 0 }));
}
