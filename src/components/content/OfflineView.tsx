"use client";

import { useEffect, useState } from "react";
import { WifiOff, RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useUI } from "@/components/providers/UIProvider";

/** Tela 106: estado de erro de conexão em tela cheia, com nova tentativa. */
export function OfflineView() {
  const { toast } = useUI();
  const [online, setOnline] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  const retry = () => {
    setChecking(true);
    window.setTimeout(() => {
      setChecking(false);
      if (navigator.onLine) {
        toast("Conexão restabelecida", { message: "Tudo certo, você pode continuar navegando." });
      } else {
        toast("Ainda sem conexão", { message: "Verifique o Wi-Fi ou os dados móveis.", variant: "error" });
      }
    }, 1200);
  };

  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-ink text-white">
      <span className="pointer-events-none absolute left-1/2 top-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" aria-hidden />
      <span className="pointer-events-none absolute left-1/2 top-1/2 size-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/15" aria-hidden />
      <div className="container-km relative flex flex-col items-center py-20 text-center">
        <span className="grid size-24 place-items-center rounded-full border border-gold/50 text-gold">
          <WifiOff className="size-9" strokeWidth={1} />
        </span>
        <span className="mt-10 text-[11px] uppercase tracking-[0.3em] text-champagne/70">Erro de conexão</span>
        <h1 className="mt-4 max-w-xl text-4xl font-light leading-tight text-white md:text-6xl">Parece que você está sem internet</h1>
        <span className="mt-6 block h-px w-12 bg-gold" />
        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-champagne">
          Não conseguimos carregar esta página. Confira o Wi-Fi ou os dados móveis e tente novamente. Sua sacola e seus
          favoritos ficam salvos neste dispositivo.
        </p>

        <ul className="mt-8 flex flex-col gap-2 text-left text-sm text-champagne/90">
          {["Ative e desative o modo avião", "Aproxime-se do roteador", "Desative VPNs ou bloqueadores"].map((t) => (
            <li key={t} className="flex items-center gap-3">
              <span className="size-1.5 rotate-45 bg-gold" /> {t}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button variant="gold" onClick={retry} disabled={checking}>
            <RefreshCw className={checking ? "size-4 animate-spin" : "size-4"} strokeWidth={1.3} />
            {checking ? "Verificando..." : "Tentar novamente"}
          </Button>
          <Button variant="light" href="/">
            Ir para o início
          </Button>
        </div>

        <p className="mt-10 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-taupe" aria-live="polite">
          {online === null ? (
            "Verificando status da rede"
          ) : online ? (
            <>
              <Check className="size-3.5 text-gold" strokeWidth={1.5} /> Seu dispositivo está online agora
            </>
          ) : (
            <>
              <span className="size-2 rounded-full bg-danger" /> Dispositivo offline
            </>
          )}
        </p>
      </div>
    </section>
  );
}
