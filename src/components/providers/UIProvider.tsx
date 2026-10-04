"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export type Overlay =
  | { type: "menu" }
  | { type: "search" }
  | { type: "cart" }
  | { type: "wishlist" }
  | { type: "login" }
  | { type: "signup" }
  | { type: "quickview"; productId: string }
  | { type: "cep" }
  | { type: "locale" }
  | { type: "coupon" }
  | {
      type: "confirm";
      title: string;
      message: string;
      confirmLabel?: string;
      tone?: "default" | "danger";
      onConfirm: () => void;
    }
  | null;

export type ToastVariant = "success" | "error" | "info";
export interface Toast {
  id: number;
  title: string;
  message?: string;
  variant: ToastVariant;
}

interface UIContext {
  overlay: Overlay;
  open: (o: Exclude<Overlay, null>) => void;
  close: () => void;
  is: (type: NonNullable<Overlay>["type"]) => boolean;
  toasts: Toast[];
  toast: (title: string, opts?: { message?: string; variant?: ToastVariant }) => void;
  dismissToast: (id: number) => void;
  confirm: (opts: Omit<Extract<Overlay, { type: "confirm" }>, "type">) => void;
}

const Ctx = createContext<UIContext | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);
  const pathname = usePathname();

  // Fecha overlays ao trocar de página
  useEffect(() => {
    setOverlay(null);
  }, [pathname]);

  // Trava a rolagem do body quando há overlay aberto
  useEffect(() => {
    document.body.style.overflow = overlay ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOverlay(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [overlay]);

  const dismissToast = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const toast = useCallback<UIContext["toast"]>(
    (title, opts) => {
      const id = ++idRef.current;
      setToasts((t) => [...t.slice(-2), { id, title, message: opts?.message, variant: opts?.variant ?? "success" }]);
      window.setTimeout(() => dismissToast(id), 4200);
    },
    [dismissToast]
  );

  const value: UIContext = {
    overlay,
    open: setOverlay,
    close: () => setOverlay(null),
    is: (type) => overlay?.type === type,
    toasts,
    toast,
    dismissToast,
    confirm: (opts) => setOverlay({ type: "confirm", ...opts }),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUI() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useUI deve ser usado dentro de <UIProvider>");
  return ctx;
}
