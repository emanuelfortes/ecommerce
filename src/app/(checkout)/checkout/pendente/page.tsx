import type { Metadata } from "next";
import { PendingView } from "@/components/checkout/OutcomeViews";

export const metadata: Metadata = {
  title: "Aguardando pagamento",
  description: "Seu pedido está reservado e aguarda a confirmação do pagamento.",
  robots: { index: false, follow: false },
};

/** Tela 40: Pagamento pendente. Aceita ?metodo=pix|boleto para demonstração. */
export default async function Page({ searchParams }: { searchParams: Promise<{ metodo?: string }> }) {
  const { metodo } = await searchParams;
  return <PendingView metodo={metodo === "pix" || metodo === "boleto" ? metodo : undefined} />;
}
