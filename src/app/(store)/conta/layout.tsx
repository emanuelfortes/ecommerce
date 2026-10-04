import type { Metadata } from "next";
import { AccountShell } from "@/components/account/AccountShell";

export const metadata: Metadata = {
  title: { default: "Minha conta", template: "%s · Minha conta · Karen Michelly" },
  robots: { index: false, follow: false },
};

/** Layout da área da cliente: saudação, menu lateral (desktop) e abas (mobile). */
export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <AccountShell>{children}</AccountShell>;
}
