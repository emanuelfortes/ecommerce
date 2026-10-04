"use client";

import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/account/AuthForms";
import { useUI } from "@/components/providers/UIProvider";

/** Login compacto da tela 108: após entrar, volta para a área da conta. */
export function SessionExpiredLogin() {
  const router = useRouter();
  const { open } = useUI();
  return <LoginForm compact onSuccess={() => router.push("/conta")} onSignup={() => open({ type: "signup" })} />;
}
