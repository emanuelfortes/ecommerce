import { notFound } from "next/navigation";
import { addresses, getAddress } from "@/lib/data";
import { privateMeta } from "@/components/account/meta";
import { AddressForm } from "@/components/account/AddressViews";

export const metadata = privateMeta("Editar endereço");

export function generateStaticParams() {
  return addresses.map((a) => ({ id: a.id }));
}

/** Tela 53: Editar endereço */
export default async function EditAddressPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const address = getAddress(id);
  if (!address) notFound();
  return <AddressForm address={address} />;
}
