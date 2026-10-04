"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";

/**
 * Animações de scroll com AOS.
 * Apenas DUAS animações são usadas no projeto inteiro: "fade-up" e "zoom-in".
 * once: false + mirror: true faz com que se repitam a cada entrada/saída do viewport.
 */
export function AosInit() {
  const pathname = usePathname();

  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      once: false,
      mirror: true,
      offset: 40,
      anchorPlacement: "top-bottom",
    });
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => AOS.refreshHard(), 80);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return null;
}

