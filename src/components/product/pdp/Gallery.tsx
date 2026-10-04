"use client";

import { useState, type MouseEvent } from "react";
import clsx from "clsx";
import { ArrowLeft, ArrowRight, Expand, ZoomIn, ZoomOut } from "lucide-react";
import type { Product } from "@/lib/types";
import { discountPercent } from "@/lib/data";
import { ProductImage } from "@/components/product/ProductImage";
import { Modal } from "@/components/ui/Overlay";
import { Badge } from "@/components/ui/Primitives";

const VIEWS = ["Frente", "Detalhe", "Costas", "Editorial"];

/** Tela 10: Galeria de imagens do produto (miniaturas, zoom no hover e tela cheia). */
export function Gallery({ product, color }: { product: Product; color: string }) {
  const [active, setActive] = useState(0);
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const [lbZoom, setLbZoom] = useState(false);
  const [lbOrigin, setLbOrigin] = useState({ x: 50, y: 50 });
  const off = discountPercent(product);

  const track = (e: MouseEvent<HTMLElement>, set: (o: { x: number; y: number }) => void) => {
    const r = e.currentTarget.getBoundingClientRect();
    set({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };
  const go = (dir: 1 | -1) => setActive((i) => (i + dir + 4) % 4);

  return (
    <div className="flex flex-col-reverse gap-3 lg:flex-row lg:gap-4">
      {/* Miniaturas */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto lg:w-20 lg:shrink-0 lg:flex-col lg:overflow-visible">
        {VIEWS.map((label, i) => (
          <button
            key={label}
            onClick={() => setActive(i)}
            aria-label={`Ver imagem: ${label}`}
            aria-current={active === i}
            className={clsx(
              "relative w-16 shrink-0 border transition-colors lg:w-full",
              active === i ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"
            )}
          >
            <ProductImage product={product} index={i} color={color} />
            {active === i && <span className="absolute inset-x-0 -bottom-px h-px bg-gold" />}
          </button>
        ))}
      </div>

      {/* Imagem principal com zoom no hover */}
      <div className="relative flex-1">
        <button
          type="button"
          onClick={() => setLightbox(true)}
          onMouseMove={(e) => track(e, setOrigin)}
          onMouseLeave={() => setOrigin(null)}
          aria-label="Abrir imagem em tela cheia"
          className="group relative block w-full cursor-zoom-in overflow-hidden bg-nude"
        >
          <div
            className="transition-transform duration-300 ease-out"
            style={{
              transform: origin ? "scale(1.9)" : "scale(1)",
              transformOrigin: origin ? `${origin.x}% ${origin.y}%` : "50% 50%",
            }}
          >
            <ProductImage product={product} index={active} color={color} />
          </div>
          <span className="pointer-events-none absolute bottom-4 right-4 grid size-10 place-items-center rounded-full bg-white/90 text-ink opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 max-md:opacity-100">
            <Expand className="size-4" strokeWidth={1.3} />
          </span>
        </button>

        <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1.5">
          {product.stock === "esgotado" && <Badge tone="ink">Esgotado</Badge>}
          {product.stock === "indisponivel" && <Badge tone="white">Indisponível</Badge>}
          {product.isNew && product.stock === "disponivel" && <Badge tone="white">Novo</Badge>}
          {off > 0 && <Badge tone="gold">-{off}%</Badge>}
        </div>

        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 md:hidden">
          <button onClick={() => go(-1)} aria-label="Imagem anterior" className="grid size-9 place-items-center rounded-full bg-white/80 text-ink">
            <ArrowLeft className="size-4" strokeWidth={1.3} />
          </button>
          <button onClick={() => go(1)} aria-label="Próxima imagem" className="grid size-9 place-items-center rounded-full bg-white/80 text-ink">
            <ArrowRight className="size-4" strokeWidth={1.3} />
          </button>
        </div>
        <p className="mt-3 text-center text-[10px] uppercase tracking-[0.22em] text-taupe">
          {VIEWS[active]} · {active + 1}/4 <span className="hidden md:inline">· passe o cursor para ampliar</span>
        </p>
      </div>

      {/* Lightbox em tela cheia */}
      <Modal
        open={lightbox}
        onClose={() => {
          setLightbox(false);
          setLbZoom(false);
        }}
        size="xl"
        className="bg-ink! text-white"
      >
        <div className="flex flex-col items-center gap-4 p-4 pt-14 text-white md:p-8 md:pt-14">
          <div className="relative w-full max-w-[calc(72vh*0.75)]">
            <button
              type="button"
              onClick={() => setLbZoom((z) => !z)}
              onMouseMove={(e) => track(e, setLbOrigin)}
              className={clsx("block w-full overflow-hidden", lbZoom ? "cursor-zoom-out" : "cursor-zoom-in")}
              aria-label={lbZoom ? "Reduzir zoom" : "Ampliar"}
            >
              <div
                className="transition-transform duration-300"
                style={{ transform: lbZoom ? "scale(2.2)" : "scale(1)", transformOrigin: `${lbOrigin.x}% ${lbOrigin.y}%` }}
              >
                <ProductImage product={product} index={active} color={color} />
              </div>
            </button>
            <button
              onClick={() => go(-1)}
              aria-label="Imagem anterior"
              className="absolute left-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-ink/70 text-white hover:text-gold md:-left-16"
            >
              <ArrowLeft className="size-4" strokeWidth={1.3} />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Próxima imagem"
              className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-ink/70 text-white hover:text-gold md:-right-16"
            >
              <ArrowRight className="size-4" strokeWidth={1.3} />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {VIEWS.map((label, i) => (
                <button
                  key={label}
                  onClick={() => setActive(i)}
                  aria-label={label}
                  className={clsx("w-12 border", active === i ? "border-gold" : "border-transparent opacity-60 hover:opacity-100")}
                >
                  <ProductImage product={product} index={i} color={color} />
                </button>
              ))}
            </div>
            <button
              onClick={() => setLbZoom((z) => !z)}
              className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-champagne hover:text-gold"
            >
              {lbZoom ? <ZoomOut className="size-4" strokeWidth={1.3} /> : <ZoomIn className="size-4" strokeWidth={1.3} />}
              {lbZoom ? "Reduzir" : "Ampliar"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
