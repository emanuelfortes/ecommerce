import type { ArtKind } from "@/lib/types";

/** Ilustração editorial usada para representar cada marca. */
export const brandArt: Record<string, { art: ArtKind; color: string; tone: number; variant: number }> = {
  "km-atelier": { art: "dress", color: "#D8C3A5", tone: 0, variant: 0 },
  "km-essentials": { art: "knit", color: "#F7F4EF", tone: 1, variant: 0 },
  "km-noir": { art: "dress", color: "#24211F", tone: 3, variant: 3 },
  "maison-dore": { art: "bag", color: "#A87B4F", tone: 2, variant: 0 },
};

export const getBrandArt = (slug: string) => brandArt[slug] ?? { art: "dress" as ArtKind, color: "#D8C3A5", tone: 0, variant: 0 };
