"use client";

import { useState } from "react";
import { Ruler } from "lucide-react";
import type { Product } from "@/lib/types";
import { Modal } from "@/components/ui/Overlay";
import { measurements, shoeLength } from "./pdpData";

/** Botão "Guia de medidas" + modal com a tabela de medidas do produto. */
export function SizeGuide({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const isShoe = product.subcategory === "calcados";
  const rows = product.sizes.filter((s) => (isShoe ? shoeLength[s] : measurements[s]));
  if (!rows.length) return null;
  const hasBust = !isShoe && rows.some((s) => measurements[s]?.busto);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-graphite underline decoration-gold underline-offset-4 hover:text-ink"
      >
        <Ruler className="size-3.5" strokeWidth={1.3} /> Guia de medidas
      </button>
      <Modal open={open} onClose={() => setOpen(false)} size="lg">
        <div className="p-6 md:p-10">
          <span className="eyebrow">Encontre o seu tamanho</span>
          <h2 className="mt-2 text-3xl md:text-4xl">Guia de medidas</h2>
          <span className="gold-rule mt-4" />
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-taupe">
            Medidas do corpo em centímetros. Se estiver entre dois tamanhos, escolha o maior para um caimento mais solto.
          </p>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-ink text-[11px] uppercase tracking-[0.18em] text-ink">
                  <th className="py-3 pr-4 font-medium">Tamanho</th>
                  {isShoe ? (
                    <th className="py-3 pr-4 font-medium">Comprimento do pé</th>
                  ) : (
                    <>
                      {hasBust && <th className="py-3 pr-4 font-medium">Busto</th>}
                      <th className="py-3 pr-4 font-medium">Cintura</th>
                      <th className="py-3 pr-4 font-medium">Quadril</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s} className="border-b border-line">
                    <td className="py-3 pr-4 font-serif text-lg text-ink">{s}</td>
                    {isShoe ? (
                      <td className="py-3 pr-4 tabular-nums text-graphite">{shoeLength[s]} cm</td>
                    ) : (
                      <>
                        {hasBust && <td className="py-3 pr-4 tabular-nums text-graphite">{measurements[s]?.busto} cm</td>}
                        <td className="py-3 pr-4 tabular-nums text-graphite">{measurements[s]?.cintura} cm</td>
                        <td className="py-3 pr-4 tabular-nums text-graphite">{measurements[s]?.quadril} cm</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 grid gap-4 text-sm text-graphite sm:grid-cols-3">
            {(isShoe
              ? [["Pé", "Do calcanhar à ponta do dedo mais longo, em pé."]]
              : [
                  ["Busto", "Na parte mais cheia do busto, com a fita reta nas costas."],
                  ["Cintura", "Na parte mais fina do tronco, sem apertar."],
                  ["Quadril", "Na parte mais larga do quadril, com os pés juntos."],
                ]
            ).map(([t, d]) => (
              <div key={t} className="border-t border-line pt-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-ink">
                  <span className="mr-2 inline-block size-1.5 rotate-45 bg-gold align-middle" />
                  {t}
                </p>
                <p className="mt-1.5 text-taupe">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}
