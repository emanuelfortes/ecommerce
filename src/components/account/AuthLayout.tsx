import type { ReactNode } from "react";
import type { ArtKind } from "@/lib/types";
import { aos } from "@/lib/aos";
import { ProductArt } from "@/components/product/ProductArt";

/** Layout dividido das telas de autenticação: painel editorial à esquerda, formulário à direita. */
export function AuthLayout({
  eyebrow,
  title,
  text,
  art = "dress",
  color = "#D8C3A5",
  quote = "Vestir-se bem é uma forma silenciosa de cuidado consigo mesma.",
  author = "Karen Michelly, fundadora",
  children,
  wide,
}: {
  eyebrow: string;
  title: ReactNode;
  text?: ReactNode;
  art?: ArtKind;
  color?: string;
  quote?: string;
  author?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <section className="grid lg:min-h-[calc(100vh-80px)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <div className="absolute inset-0" {...aos.zoomIn()}>
          <ProductArt kind={art} tone={3} variant={3} color={color} className="size-full" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" aria-hidden />
        <span className="eyebrow relative flex items-center gap-3 text-champagne/80">
          <span className="h-px w-8 bg-gold" /> Karen Michelly · Woman Wear
        </span>
        <figure className="relative max-w-md" {...aos.fadeUp(150)}>
          <span className="block h-px w-12 bg-gold" />
          <blockquote className="mt-6 font-serif text-4xl font-light italic leading-snug text-white xl:text-5xl">“{quote}”</blockquote>
          <figcaption className="mt-5 text-[11px] uppercase tracking-[0.24em] text-gold">{author}</figcaption>
        </figure>
      </div>

      <div className="flex items-center bg-offwhite">
        <div className={wide ? "mx-auto w-full max-w-xl px-4 py-14 sm:px-6 md:py-20" : "mx-auto w-full max-w-md px-4 py-14 sm:px-6 md:py-20"}>
          <div {...aos.fadeUp()} className="mb-10 flex flex-col gap-3">
            <span className="eyebrow">{eyebrow}</span>
            <h1 className="text-4xl leading-tight md:text-5xl">{title}</h1>
            <span className="gold-rule mt-1" />
            {text && <p className="text-[15px] leading-relaxed text-taupe">{text}</p>}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
