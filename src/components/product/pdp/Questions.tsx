"use client";

import { useState, type FormEvent } from "react";
import { MessageCircleQuestion, Search } from "lucide-react";
import type { Question } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { useUI } from "@/components/providers/UIProvider";
import { useStore } from "@/components/providers/StoreProvider";
import { Field, TextArea } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";

/** Tela 12: Perguntas e respostas. */
export function Questions({ productId, initial }: { productId: string; initial: Question[] }) {
  const { toast } = useUI();
  const { user } = useStore();
  const [items, setItems] = useState<Question[]>(initial);
  const [term, setTerm] = useState("");
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const shown = items.filter((q) => !term.trim() || `${q.question} ${q.answer ?? ""}`.toLowerCase().includes(term.toLowerCase()));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const author = (name || user?.name || "").trim();
    if (!author) return setError("Informe seu nome.");
    if (text.trim().length < 10) return setError("Escreva sua pergunta com pelo menos 10 caracteres.");
    setError("");
    setItems((l) => [
      { id: `local-${Date.now()}`, productId, author, question: text.trim(), date: new Date().toISOString().slice(0, 10) },
      ...l,
    ]);
    setText("");
    toast("Pergunta enviada", { message: "Nossa equipe responde em até 24h úteis." });
  };

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-7">
        {items.length > 2 && (
          <label className="relative mb-6 block">
            <span className="sr-only">Buscar nas perguntas</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-taupe" strokeWidth={1.3} />
            <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Buscar nas perguntas" className="field pl-11" />
          </label>
        )}
        {shown.length === 0 ? (
          <div className="flex flex-col items-center border border-dashed border-champagne bg-white px-6 py-12 text-center">
            <MessageCircleQuestion className="size-7 text-gold" strokeWidth={1.1} />
            <p className="mt-4 font-serif text-2xl text-ink">{items.length ? "Nada encontrado" : "Ainda não há perguntas"}</p>
            <p className="mt-2 text-sm text-taupe">
              {items.length ? "Tente outro termo ou envie sua dúvida." : "Seja a primeira a perguntar sobre esta peça."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {shown.map((q) => (
              <li key={q.id} className="py-6">
                <p className="flex gap-3 text-[15px] text-ink">
                  <span className="font-serif text-xl leading-none text-gold">P.</span>
                  {q.question}
                </p>
                <p className="mt-1 pl-7 text-[11px] uppercase tracking-[0.16em] text-taupe">
                  {q.author} · {formatDate(q.date)}
                </p>
                {q.answer ? (
                  <div className="ml-7 mt-4 border-l border-gold pl-4">
                    <p className="text-sm leading-relaxed text-graphite/85">{q.answer}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-taupe">Equipe Karen Michelly</p>
                  </div>
                ) : (
                  <p className="ml-7 mt-3 text-xs italic text-taupe">Aguardando resposta da nossa equipe.</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={submit} className="flex flex-col gap-4 self-start border border-line bg-white p-6 md:p-8 lg:col-span-5">
        <span className="eyebrow">Tem alguma dúvida?</span>
        <h3 className="font-serif text-3xl text-ink">Pergunte à nossa equipe</h3>
        <span className="gold-rule" />
        <Field label="Seu nome" value={name} onChange={(e) => setName(e.target.value)} placeholder={user?.name ?? "Como podemos te chamar?"} />
        <TextArea
          label="Sua pergunta"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ex.: Qual o comprimento no tamanho M?"
          maxLength={400}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
        <Button type="submit">Enviar pergunta</Button>
        <p className="text-xs text-taupe">Respondemos em até 24h úteis. Sua pergunta ficará pública nesta página.</p>
      </form>
    </div>
  );
}
