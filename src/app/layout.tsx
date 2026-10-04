import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/300.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource-variable/jost";
import "./globals.css";
import { StoreProvider } from "@/components/providers/StoreProvider";
import { UIProvider } from "@/components/providers/UIProvider";
import { AosInit } from "@/components/providers/AosInit";
import { OverlayRoot } from "@/components/overlays/OverlayRoot";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.karenmichelly.com.br"),
  title: {
    default: "Karen Michelly · Woman Wear",
    template: "%s · Karen Michelly",
  },
  description:
    "Moda feminina elegante e contemporânea. Vestidos, alfaiataria, seda e acessórios com acabamento de ateliê.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Karen Michelly Woman Wear",
    images: ["/brand/karen-michelly-logo.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0D0D0D",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-gold focus:px-4 focus:py-2 focus:text-ink">
          Pular para o conteúdo
        </a>
        <StoreProvider>
          <UIProvider>
            {children}
            <OverlayRoot />
            <AosInit />
          </UIProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
