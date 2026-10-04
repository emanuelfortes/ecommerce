import { privateMeta } from "@/components/account/meta";
import { NotificationsView } from "@/components/account/NotificationsView";

export const metadata = privateMeta("Notificações");

/** Telas 65 e 105 (central vazia com ?vazio=1) */
export default async function NotificationsPage({ searchParams }: { searchParams: Promise<{ vazio?: string }> }) {
  const { vazio } = await searchParams;
  return <NotificationsView empty={vazio === "1"} />;
}
