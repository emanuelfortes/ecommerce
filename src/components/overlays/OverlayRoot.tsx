"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { MobileMenu, SearchOverlay } from "./Navigation";
import { CartDrawer, WishlistDrawer, QuickView, CouponModal } from "./Commerce";
import { AuthModals, CepModal, LocaleModal, ConfirmModal, CookieConsent, Toaster } from "./System";
import { useUI } from "@/components/providers/UIProvider";
import { useStore } from "@/components/providers/StoreProvider";
import { ConnectionStatus } from "@/components/shared/ConnectionStatus";

/** Abre o modal de cupom uma única vez para novas visitantes, depois do consentimento de cookies. */
function PromoTrigger() {
  const pathname = usePathname();
  const { open, overlay } = useUI();
  const { cookieConsent, hydrated } = useStore();
  useEffect(() => {
    if (!hydrated || !cookieConsent || pathname !== "/") return;
    let seen = "1";
    try {
      seen = localStorage.getItem("km-promo-seen") ?? "";
    } catch {}
    if (seen) return;
    const t = window.setTimeout(() => {
      if (!overlay) {
        open({ type: "coupon" });
        try {
          localStorage.setItem("km-promo-seen", "1");
        } catch {}
      }
    }, 12000);
    return () => window.clearTimeout(t);
  }, [hydrated, cookieConsent, pathname, overlay, open]);
  return null;
}

/** Monta todas as camadas globais (drawers, modais, toasts, cookies). */
export function OverlayRoot() {
  return (
    <>
      <MobileMenu />
      <SearchOverlay />
      <CartDrawer />
      <WishlistDrawer />
      <QuickView />
      <CouponModal />
      <AuthModals />
      <CepModal />
      <LocaleModal />
      <ConfirmModal />
      <CookieConsent />
      <Toaster />
      <PromoTrigger />
      <ConnectionStatus />
    </>
  );
}
