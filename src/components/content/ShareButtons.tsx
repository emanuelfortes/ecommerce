"use client";

import { Link2 } from "lucide-react";
import { SocialIcon } from "@/components/shared/Brand";
import { useUI } from "@/components/providers/UIProvider";

const SITE = "https://www.karenmichelly.com.br";

/** Botões de compartilhamento do artigo (WhatsApp, Facebook, Pinterest e copiar link). */
export function ShareButtons({ path, title, vertical }: { path: string; title: string; vertical?: boolean }) {
  const { toast } = useUI();
  const url = `${SITE}${path}`;
  const enc = encodeURIComponent;
  const links = [
    { name: "whatsapp" as const, label: "WhatsApp", href: `https://wa.me/?text=${enc(`${title} ${url}`)}` },
    { name: "facebook" as const, label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
    { name: "pinterest" as const, label: "Pinterest", href: `https://pinterest.com/pin/create/button/?url=${enc(url)}&description=${enc(title)}` },
  ];
  const btn =
    "grid size-10 place-items-center rounded-full border border-line bg-white text-ink transition-colors hover:border-gold hover:text-gold";

  return (
    <div className={vertical ? "flex flex-col items-center gap-2" : "flex items-center gap-2"}>
      <span className={vertical ? "mb-2 text-[10px] uppercase tracking-[0.24em] text-taupe [writing-mode:vertical-rl]" : "mr-2 text-[11px] uppercase tracking-[0.2em] text-taupe"}>
        Compartilhar
      </span>
      {links.map((l) => (
        <a key={l.name} href={l.href} target="_blank" rel="noreferrer" aria-label={`Compartilhar no ${l.label}`} className={btn}>
          <SocialIcon name={l.name} className="size-4" />
        </a>
      ))}
      <button
        type="button"
        aria-label="Copiar link"
        className={btn}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            toast("Link copiado", { message: "Agora é só colar onde quiser.", variant: "info" });
          } catch {
            toast("Não foi possível copiar", { message: url, variant: "error" });
          }
        }}
      >
        <Link2 className="size-4" strokeWidth={1.3} />
      </button>
    </div>
  );
}
