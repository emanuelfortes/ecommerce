import { Header } from "@/components/layout/Header";
import { Footer, Newsletter } from "@/components/layout/Footer";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="conteudo" className="min-h-[60vh]">
        {children}
      </main>
      <Newsletter />
      <Footer />
    </>
  );
}
