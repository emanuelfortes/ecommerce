import { privateMeta } from "@/components/account/meta";
import { PaymentsView } from "@/components/account/PaymentViews";

export const metadata = privateMeta("Pagamentos");

/** Tela 61: Pagamentos */
export default function PaymentsPage() {
  return <PaymentsView />;
}
