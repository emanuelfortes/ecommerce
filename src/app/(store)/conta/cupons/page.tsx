import { privateMeta } from "@/components/account/meta";
import { CouponsView } from "@/components/account/CouponsView";

export const metadata = privateMeta("Meus cupons");

/** Tela 62: Cupons */
export default function AccountCouponsPage() {
  return <CouponsView />;
}
