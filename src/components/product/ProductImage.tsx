import clsx from "clsx";
import type { Product } from "@/lib/types";
import { ProductArt } from "./ProductArt";

/**
 * Exibe a foto real do produto (product.images[index]) ou, na ausência,
 * a ilustração editorial. Proporção 3:4, padrão de moda.
 */
export function ProductImage({
  product,
  index = 0,
  color,
  className,
  sizes,
}: {
  product: Product;
  index?: number;
  color?: string;
  className?: string;
  sizes?: string;
}) {
  const imgs = product.images ?? [];
  // com menos fotos que posições pedidas, repete as fotos em vez de cair na ilustração
  const src = imgs.length ? imgs[index % imgs.length] : undefined;
  const hex = product.colors.find((c) => c.name === color)?.hex ?? product.colors[0]?.hex;
  return (
    <div className={clsx("relative aspect-[3/4] w-full overflow-hidden bg-nude", className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={product.name} sizes={sizes} className="absolute inset-0 size-full object-cover object-top" loading="lazy" />
      ) : (
        <ProductArt
          kind={product.art}
          tone={product.tone}
          color={hex}
          variant={index}
          label={product.name}
          className="absolute inset-0 size-full"
        />
      )}
    </div>
  );
}
