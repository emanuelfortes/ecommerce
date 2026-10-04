import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { Logo } from "@/components/shared/Brand";
import { CheckoutStateProvider } from "@/components/checkout/CheckoutState";
import { PaymentBadges } from "@/components/checkout/CheckoutParts";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

const legal = [
  { label: "Privacidade", href: "/politica-de-privacidade" },
  { label: "Termos de uso", href: "/termos-de-uso" },
  { label: "Trocas e devoluções", href: "/politica-de-troca-e-devolucao" },
  { label: "Entrega", href: "/politica-de-entrega" },
  { label: "Pagamento", href: "/politica-de-pagamento" },
];

/** Layout enxuto do checkout: sem menu, sem newsletter, foco total na compra. */
export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <CheckoutStateProvider>
      <header className="bg-ink text-offwhite">
        <div className="container-km grid h-20 grid-cols-[1fr_auto_1fr] items-center gap-4 md:h-24">
          <Link
            href="/carrinho"
            className="flex items-center gap-2 justify-self-start text-[11px] uppercase tracking-[0.2em] text-offwhite/80 transition-colors hover:text-gold"
          >
            <ArrowLeft className="size-4" strokeWidth={1.2} />
            <span className="hidden sm:inline">Voltar à sacola</span>
          </Link>
          <Logo variant="dark" className="[&_img]:size-10 md:[&_img]:size-12 [&>span]:hidden md:[&>span]:flex" />
          <p className="flex items-center gap-2 justify-self-end text-[11px] uppercase tracking-[0.2em] text-champagne">
            <Lock className="size-4 text-gold" strokeWidth={1.2} />
            <span className="hidden sm:inline">Compra 100% segura</span>
          </p>
        </div>
        <span className="block h-px bg-linear-to-r from-transparent via-gold/60 to-transparent" />
      </header>

      <main id="conteudo" className="min-h-[70vh] bg-offwhite">
        {children}
      </main>

      <footer className="border-t border-line bg-white">
        <div className="container-km flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3">
            <PaymentBadges />
            <p className="text-[11px] leading-relaxed text-taupe">
              © {new Date().getFullYear()} Karen Michelly Woman Wear · CNPJ 00.000.000/0001-00 · Seus dados são protegidos
              conforme a LGPD.
            </p>
          </div>
          <nav aria-label="Links legais" className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
            {legal.map((l) => (
              <Link key={l.href} href={l.href} className="text-graphite/80 transition-colors hover:text-gold">
                {l.label}
              </Link>
            ))}
            <Link href="/contato" className="text-graphite/80 transition-colors hover:text-gold">
              Ajuda
            </Link>
          </nav>
        </div>
      </footer>
    </CheckoutStateProvider>
  );
}
