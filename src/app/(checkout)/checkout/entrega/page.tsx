import type { Metadata } from "next";
import { DeliveryStep } from "@/components/checkout/DeliveryStep";

export const metadata: Metadata = {
  title: "Entrega",
  description: "Escolha o endereço e a forma de entrega do seu pedido.",
  robots: { index: false, follow: false },
};

/** Telas 28, 29 e 30: Endereço, seleção de endereço e frete */
export default function Page() {
  return <DeliveryStep />;
}
