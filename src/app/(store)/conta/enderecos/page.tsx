import { privateMeta } from "@/components/account/meta";
import { AddressList } from "@/components/account/AddressViews";

export const metadata = privateMeta("Endereços");

/** Telas 51 e 104 (estado vazio com ?vazio=1) */
export default async function AddressesPage({ searchParams }: { searchParams: Promise<{ vazio?: string }> }) {
  const { vazio } = await searchParams;
  return <AddressList empty={vazio === "1"} />;
}
