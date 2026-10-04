"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { coupons, getProduct } from "@/lib/data";
import type { CartItem, Coupon } from "@/lib/types";
import { formatMoney, type Currency, type Locale } from "@/lib/format";

export interface User {
  name: string;
  email: string;
}

interface StoreState {
  cart: CartItem[];
  wishlist: string[];
  compare: string[];
  user: User | null;
  cep: string;
  currency: Currency;
  locale: Locale;
  coupon: string | null;
  cookieConsent: "all" | "essential" | null;
}

const initial: StoreState = {
  cart: [],
  wishlist: [],
  compare: [],
  user: null,
  cep: "",
  currency: "BRL",
  locale: "pt-BR",
  coupon: null,
  cookieConsent: null,
};

const STORAGE_KEY = "km-store-v1";

interface StoreContext extends StoreState {
  hydrated: boolean;
  addToCart: (productId: string, size: string, color: string, qty?: number) => void;
  updateQty: (key: string, qty: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => boolean;
  isWished: (productId: string) => boolean;
  toggleCompare: (productId: string) => "added" | "removed" | "full";
  login: (user: User) => void;
  logout: () => void;
  setCep: (cep: string) => void;
  setCurrency: (c: Currency) => void;
  setLocale: (l: Locale) => void;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  removeCoupon: () => void;
  setCookieConsent: (v: "all" | "essential") => void;
  money: (v: number) => string;
  cartCount: number;
  subtotal: number;
  discount: number;
  activeCoupon: Coupon | null;
}

const Ctx = createContext<StoreContext | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(initial);
  const [hydrated, setHydrated] = useState(false);

  // Carrega do navegador (somente preferências e carrinho da visitante)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initial, ...JSON.parse(raw) });
    } catch {
      /* armazenamento indisponível: segue com estado em memória */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignora */
    }
  }, [state, hydrated]);

  const patch = useCallback(
    (p: Partial<StoreState> | ((s: StoreState) => Partial<StoreState>)) =>
      setState((s) => ({ ...s, ...(typeof p === "function" ? p(s) : p) })),
    []
  );

  const addToCart = useCallback(
    (productId: string, size: string, color: string, qty = 1) =>
      patch((s) => {
        const key = `${productId}-${size}-${color}`;
        const found = s.cart.find((i) => i.key === key);
        return {
          cart: found
            ? s.cart.map((i) => (i.key === key ? { ...i, qty: Math.min(10, i.qty + qty) } : i))
            : [...s.cart, { key, productId, size, color, qty }],
        };
      }),
    [patch]
  );

  const updateQty = useCallback(
    (key: string, qty: number) =>
      patch((s) => ({
        cart: s.cart.map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(10, qty)) } : i)),
      })),
    [patch]
  );

  const removeFromCart = useCallback(
    (key: string) => patch((s) => ({ cart: s.cart.filter((i) => i.key !== key) })),
    [patch]
  );

  const toggleWishlist = useCallback(
    (id: string) => {
      const added = !state.wishlist.includes(id);
      patch((s) => ({
        wishlist: s.wishlist.includes(id) ? s.wishlist.filter((x) => x !== id) : [...s.wishlist, id],
      }));
      return added;
    },
    [patch, state.wishlist]
  );

  const toggleCompare = useCallback(
    (id: string): "added" | "removed" | "full" => {
      if (state.compare.includes(id)) {
        patch((s) => ({ compare: s.compare.filter((x) => x !== id) }));
        return "removed";
      }
      if (state.compare.length >= 4) return "full";
      patch((s) => ({ compare: [...s.compare, id] }));
      return "added";
    },
    [patch, state.compare]
  );

  const subtotal = useMemo(
    () =>
      state.cart.reduce((sum, i) => sum + (getProduct(i.productId)?.price ?? 0) * i.qty, 0),
    [state.cart]
  );

  const activeCoupon = useMemo(
    () => coupons.find((c) => c.code === state.coupon) ?? null,
    [state.coupon]
  );

  const discount = useMemo(() => {
    if (!activeCoupon) return 0;
    if (subtotal < activeCoupon.minValue) return 0;
    if (activeCoupon.type === "percent") return (subtotal * activeCoupon.value) / 100;
    if (activeCoupon.type === "fixed") return activeCoupon.value;
    return 0;
  }, [activeCoupon, subtotal]);

  const applyCoupon = useCallback(
    (code: string) => {
      const c = coupons.find((x) => x.code === code.trim().toUpperCase());
      if (!c) return { ok: false, message: "Cupom inválido. Confira o código digitado." };
      if (c.status === "expirado") return { ok: false, message: "Este cupom expirou." };
      if (c.status === "usado") return { ok: false, message: "Este cupom já foi utilizado." };
      if (subtotal < c.minValue)
        return {
          ok: false,
          message: `Válido para compras acima de ${formatMoney(c.minValue)}.`,
        };
      patch({ coupon: c.code });
      return { ok: true, message: `Cupom ${c.code} aplicado com sucesso.` };
    },
    [patch, subtotal]
  );

  const value: StoreContext = {
    ...state,
    hydrated,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart: () => patch({ cart: [], coupon: null }),
    toggleWishlist,
    isWished: (id) => state.wishlist.includes(id),
    toggleCompare,
    login: (user) => patch({ user }),
    logout: () => patch({ user: null }),
    setCep: (cep) => patch({ cep }),
    setCurrency: (currency) => patch({ currency }),
    setLocale: (locale) => patch({ locale }),
    applyCoupon,
    removeCoupon: () => patch({ coupon: null }),
    setCookieConsent: (cookieConsent) => patch({ cookieConsent }),
    money: (v) => formatMoney(v, state.currency),
    cartCount: state.cart.reduce((n, i) => n + i.qty, 0),
    subtotal,
    discount,
    activeCoupon,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore deve ser usado dentro de <StoreProvider>");
  return ctx;
}
