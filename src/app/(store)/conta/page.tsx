import { privateMeta } from "@/components/account/meta";
import { AccountHeading } from "@/components/account/AccountUI";
import { AccountDashboard } from "@/components/account/AccountDashboard";

export const metadata = privateMeta("Visão geral", "Resumo dos seus pedidos, cupons, favoritos e endereços.");

/** Tela 48: Minha conta */
export default function AccountPage() {
  return (
    <>
      <AccountHeading eyebrow="Visão geral" title="Seu espaço Karen Michelly" text="Tudo o que você precisa, do último pedido aos benefícios exclusivos de cliente." />
      <AccountDashboard />
    </>
  );
}
