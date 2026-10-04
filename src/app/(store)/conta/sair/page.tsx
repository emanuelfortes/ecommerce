import { privateMeta } from "@/components/account/meta";
import { LogoutConfirm } from "@/components/account/SecurityViews";

export const metadata = privateMeta("Sair");

/** Tela 66: Sair */
export default function LogoutPage() {
  return <LogoutConfirm />;
}
