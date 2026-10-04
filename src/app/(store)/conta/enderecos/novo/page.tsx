import { privateMeta } from "@/components/account/meta";
import { AddressForm } from "@/components/account/AddressViews";

export const metadata = privateMeta("Novo endereço");

/** Tela 52: Novo endereço */
export default function NewAddressPage() {
  return <AddressForm />;
}
