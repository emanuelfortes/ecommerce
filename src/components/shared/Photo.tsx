import clsx from "clsx";

/** Foto editorial (campanha, categorias, home). Para produtos, prefira <ProductImage>. */
export function Photo({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading="lazy" className={clsx("object-cover object-top", className)} />
  );
}
