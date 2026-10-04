"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { WifiOff, Wifi, X } from "lucide-react";

/**
 * Tela 106 (global): observa os eventos online/offline do navegador.
 * - Offline: faixa preta fixa "Você está offline".
 * - Ao voltar: aviso flutuante "Conexão restabelecida" por alguns segundos.
 * Monte uma única vez no layout raiz.
 */
export function ConnectionStatus() {
  const [offline, setOffline] = useState(false);
  const [restored, setRestored] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.onLine === false) setOffline(true);
    const onOffline = () => {
      window.clearTimeout(timer.current);
      setRestored(false);
      setOffline(true);
    };
    const onOnline = () => {
      setOffline(false);
      setRestored(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setRestored(false), 4000);
    };
    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
      window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <>
      <div
        role="status"
        aria-live="assertive"
        className={clsx(
          "fixed inset-x-0 bottom-0 z-[95] border-t border-gold/40 bg-ink text-white transition-transform duration-500 ease-[var(--ease-luxe)]",
          offline ? "translate-y-0" : "pointer-events-none translate-y-full"
        )}
      >
        <div className="container-km flex items-center justify-between gap-4 py-3.5">
          <p className="flex items-center gap-3 text-sm">
            <WifiOff className="size-4 shrink-0 text-gold" strokeWidth={1.3} />
            <span>
              <span className="font-medium">Você está offline.</span>{" "}
              <span className="text-champagne">Verifique a sua conexão. Sua sacola continua salva.</span>
            </span>
          </p>
          <button
            onClick={() => window.location.reload()}
            className="shrink-0 border-b border-gold pb-0.5 text-[11px] uppercase tracking-[0.2em] text-white hover:text-gold"
          >
            Tentar novamente
          </button>
        </div>
      </div>

      {restored && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-1/2 z-[95] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-start gap-3 border-l-2 border-gold bg-ink p-4 text-white shadow-2xl"
          style={{ animation: "km-toast .5s cubic-bezier(.22,1,.36,1)" }}
        >
          <Wifi className="mt-0.5 size-5 shrink-0 text-gold" strokeWidth={1.2} />
          <div className="flex-1">
            <p className="text-sm font-medium">Conexão restabelecida</p>
            <p className="mt-0.5 text-xs text-champagne">Tudo certo, você pode continuar navegando.</p>
          </div>
          <button onClick={() => setRestored(false)} aria-label="Fechar" className="text-champagne hover:text-white">
            <X className="size-4" strokeWidth={1.2} />
          </button>
        </div>
      )}
    </>
  );
}
