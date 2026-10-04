"use client";

import clsx from "clsx";
import { useRef, useState } from "react";
import { Camera, CircleCheck, Star, X } from "lucide-react";
import type { Order, Product } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Feedback";
import { Field, TextArea, Toggle } from "@/components/ui/Form";
import { SizeSelector } from "@/components/ui/Interactive";
import { useUI } from "@/components/providers/UIProvider";
import { orderLines } from "./orderUtils";

const starLabels = ["", "Muito ruim", "Ruim", "Regular", "Muito bom", "Excelente"];

export function StarInput({ value, onChange, label, size = "md" }: { value: number; onChange: (v: number) => void; label: string; size?: "md" | "lg" }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div role="radiogroup" aria-label={label} className="flex" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={value === i}
            aria-label={`${i} de 5`}
            onMouseEnter={() => setHover(i)}
            onClick={() => onChange(i)}
            className="p-1 transition-transform hover:scale-110"
          >
            <Star
              className={clsx(size === "lg" ? "size-8" : "size-6", i <= shown ? "fill-gold text-gold" : "fill-transparent text-champagne")}
              strokeWidth={1.1}
            />
          </button>
        ))}
      </div>
      <span className="text-[11px] uppercase tracking-[0.18em] text-taupe">{starLabels[shown] || "Toque para avaliar"}</span>
    </div>
  );
}

function Block({ title, text, children }: { title: string; text?: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-line pb-8">
      <p className="font-serif text-2xl text-ink">{title}</p>
      {text && <p className="mt-1 text-sm text-taupe">{text}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

/** Tela 73: Avaliar compra */
export function OrderReviewForm({ order }: { order: Order }) {
  const { toast } = useUI();
  const [overall, setOverall] = useState(0);
  const [delivery, setDelivery] = useState(0);
  const [packaging, setPackaging] = useState(0);
  const [nps, setNps] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const lines = orderLines(order);

  if (done) {
    return (
      <div className="border border-line bg-white px-6">
        <EmptyState
          compact
          icon={<CircleCheck />}
          title="Obrigada pela avaliação"
          text="Sua opinião chega direto ao Atelier. Que tal contar também o que achou de cada peça?"
          actions={
            <>
              {lines.slice(0, 2).map((l) => (
                <Button key={l.productId} href={`/avaliar/produto/${l.product.slug}`} variant="secondary" size="sm">
                  Avaliar {l.product.name.split(" ").slice(0, 2).join(" ")}
                </Button>
              ))}
              <Button href="/conta/pedidos" size="sm">
                Meus pedidos
              </Button>
            </>
          }
        />
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!overall || !delivery || !packaging || nps === null) {
          setError("Avalie todos os itens e escolha uma nota de 0 a 10 para continuar.");
          return;
        }
        setError("");
        setDone(true);
        toast("Avaliação enviada", { message: "Obrigada por compartilhar sua experiência." });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="flex flex-col gap-8"
    >
      <Block title="Experiência geral" text="Como foi comprar com a Karen Michelly?">
        <StarInput value={overall} onChange={setOverall} label="Experiência geral" size="lg" />
      </Block>
      <div className="grid gap-8 border-b border-line pb-8 md:grid-cols-2">
        <div>
          <p className="font-serif text-2xl text-ink">Entrega</p>
          <p className="mt-1 text-sm text-taupe">Prazo e cuidado no transporte.</p>
          <div className="mt-4">
            <StarInput value={delivery} onChange={setDelivery} label="Entrega" />
          </div>
        </div>
        <div>
          <p className="font-serif text-2xl text-ink">Embalagem</p>
          <p className="mt-1 text-sm text-taupe">Apresentação e proteção das peças.</p>
          <div className="mt-4">
            <StarInput value={packaging} onChange={setPackaging} label="Embalagem" />
          </div>
        </div>
      </div>
      <Block title="Você nos recomendaria?" text="De 0 a 10, qual a chance de indicar a Karen Michelly para uma amiga?">
        <div className="grid grid-cols-11 gap-1 sm:gap-2" role="radiogroup" aria-label="Nota de recomendação">
          {Array.from({ length: 11 }, (_, i) => (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={nps === i}
              onClick={() => setNps(i)}
              className={clsx(
                "h-11 border text-sm tabular-nums transition-colors",
                nps === i ? "border-ink bg-ink text-gold" : "border-line bg-white text-graphite hover:border-ink"
              )}
            >
              {i}
            </button>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.18em] text-taupe">
          <span>Pouco provável</span>
          <span>Muito provável</span>
        </div>
      </Block>
      <TextArea label="Comentário (opcional)" placeholder="Conte o que mais gostou ou o que podemos melhorar." value={comment} onChange={(e) => setComment(e.target.value)} />
      {error && <p className="text-sm text-danger">{error}</p>}
      <div>
        <Button type="submit">Enviar avaliação</Button>
      </div>
    </form>
  );
}

const fits: { id: "pequeno" | "perfeito" | "grande"; label: string }[] = [
  { id: "pequeno", label: "Ficou pequeno" },
  { id: "perfeito", label: "Perfeito" },
  { id: "grande", label: "Ficou grande" },
];

/** Tela 74: Avaliar produto */
export function ProductReviewForm({ product }: { product: Product }) {
  const { toast } = useUI();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [fit, setFit] = useState<(typeof fits)[number]["id"]>("perfeito");
  const [size, setSize] = useState(product.sizes[Math.floor(product.sizes.length / 2)] ?? "");
  const [photos, setPhotos] = useState<string[]>([]);
  const [recommend, setRecommend] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (done) {
    return (
      <div className="border border-line bg-white px-6">
        <EmptyState
          compact
          icon={<CircleCheck />}
          title="Avaliação enviada"
          text="Sua avaliação será publicada após a moderação, em até 48 horas. Obrigada por ajudar outras clientes a escolher."
          actions={
            <>
              <Button href={`/produto/${product.slug}`}>Ver produto</Button>
              <Button href="/conta/pedidos" variant="secondary">
                Meus pedidos
              </Button>
            </>
          }
        />
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const errs: Record<string, string> = {};
        if (!rating) errs.rating = "Escolha uma nota de 1 a 5 estrelas.";
        if (title.trim().length < 3) errs.title = "Dê um título à sua avaliação.";
        if (body.trim().length < 20) errs.body = "Escreva ao menos 20 caracteres.";
        setErrors(errs);
        if (Object.keys(errs).length) return;
        setDone(true);
        toast("Avaliação enviada", { message: product.name });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="flex flex-col gap-8"
    >
      <Block title="Sua nota" text="O que você achou da peça?">
        <StarInput value={rating} onChange={setRating} label="Nota do produto" size="lg" />
        {errors.rating && <p className="mt-2 text-xs text-danger">{errors.rating}</p>}
      </Block>
      <div className="flex flex-col gap-5 border-b border-line pb-8">
        <Field label="Título" value={title} onChange={(e) => setTitle(e.target.value)} error={errors.title} placeholder="Ex.: Caimento impecável" maxLength={80} />
        <div>
          <TextArea label="Sua avaliação" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Conte sobre o tecido, o caimento e as ocasiões em que usou." />
          <div className="mt-1.5 flex justify-between text-xs">
            <span className="text-danger">{errors.body}</span>
            <span className="text-taupe">{body.length} caracteres</span>
          </div>
        </div>
      </div>
      <div className="grid gap-8 border-b border-line pb-8 md:grid-cols-2">
        <div>
          <p className="field-label">Como ficou o tamanho?</p>
          <div className="grid grid-cols-3 border border-line bg-white" role="radiogroup" aria-label="Caimento">
            {fits.map((f) => (
              <button
                key={f.id}
                type="button"
                role="radio"
                aria-checked={fit === f.id}
                onClick={() => setFit(f.id)}
                className={clsx(
                  "px-2 py-3 text-[11px] uppercase tracking-[0.14em] transition-colors",
                  fit === f.id ? "bg-ink text-white" : "text-graphite hover:text-ink"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="field-label">Tamanho comprado</p>
          <SizeSelector sizes={product.sizes} value={size} onChange={setSize} />
        </div>
      </div>
      <div className="border-b border-line pb-8">
        <p className="field-label">Fotos (opcional)</p>
        <div className="flex flex-wrap gap-3">
          {photos.map((p) => (
            <span key={p} className="relative grid size-24 place-items-center border border-line bg-nude/60 p-2 text-center text-[10px] leading-tight text-graphite">
              <span className="line-clamp-3 break-all">{p}</span>
              <button
                type="button"
                aria-label={`Remover ${p}`}
                onClick={() => setPhotos(photos.filter((x) => x !== p))}
                className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-ink text-white hover:bg-gold hover:text-ink"
              >
                <X className="size-3" strokeWidth={1.6} />
              </button>
            </span>
          ))}
          {photos.length < 4 && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex size-24 flex-col items-center justify-center gap-2 border border-dashed border-taupe/60 bg-white text-taupe transition-colors hover:border-ink hover:text-ink"
            >
              <Camera className="size-5" strokeWidth={1.2} />
              <span className="text-[10px] uppercase tracking-[0.16em]">Adicionar</span>
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => {
              const names = Array.from(e.target.files ?? []).map((f) => f.name);
              setPhotos((p) => [...p, ...names.filter((n) => !p.includes(n))].slice(0, 4));
              e.target.value = "";
            }}
          />
        </div>
        <p className="mt-2 text-xs text-taupe">Até 4 imagens em JPG ou PNG. Fotos vestindo a peça ajudam muito outras clientes.</p>
      </div>
      <div className="flex items-center justify-between gap-6 border-b border-line pb-8">
        <div>
          <p className="text-[15px] text-ink">Você recomendaria esta peça?</p>
          <p className="text-sm text-taupe">{recommend ? "Sim, recomendo" : "Não recomendo"}</p>
        </div>
        <Toggle checked={recommend} onChange={setRecommend} label="Recomendo esta peça" />
      </div>
      <div>
        <Button type="submit">Publicar avaliação</Button>
      </div>
    </form>
  );
}
