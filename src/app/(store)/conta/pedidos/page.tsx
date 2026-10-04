import { orders } from "@/lib/data";
import { privateMeta } from "@/components/account/meta";
import { AccountHeading } from "@/components/account/AccountUI";
import { Button } from "@/components/ui/Button";
import { OrdersList } from "@/components/orders/OrderClient";

export const metadata = privateMeta("Meus pedidos");

/** Telas 54 e 103 (estado vazio com ?vazio=1) */
export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ vazio?: string }> }) {
  const { vazio } = await searchParams;
  const sorted = [...orders].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <AccountHeading
        eyebrow="Compras"
        title="Meus pedidos"
        text="Acompanhe cada etapa, do Atelier até a sua porta. Trocas e devoluções podem ser solicitadas por aqui."
        action={
          <Button href="/troca" variant="secondary" size="sm">
            Trocas e devoluções
          </Button>
        }
      />
      <OrdersList orders={sorted} empty={vazio === "1"} />
    </>
  );
}
