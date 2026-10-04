import type { Metadata } from "next";
import { CartView } from "@/components/checkout/CartView";

export const metadata: Metadata = {
  title: "Sacola",
  description: "Revise as peças da sua sacola, calcule o frete e finalize sua compra com segurança.",
  robots: { index: false, follow: true },
};

/** Telas 23, 24, 25 e 101: Carrinho */
export default function CartPage() {
  return <CartView />;
}
