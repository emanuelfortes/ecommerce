import type { Metadata } from "next";
import { PaymentStep } from "@/components/checkout/PaymentStep";

export const metadata: Metadata = {
  title: "Pagamento",
  description: "Revise o pedido e escolha entre PIX, cartão de crédito ou boleto.",
  robots: { index: false, follow: false },
};

/** Telas 31 a 36: Resumo, cupom, pagamento, PIX, cartão e boleto */
export default function Page() {
  return <PaymentStep />;
}
