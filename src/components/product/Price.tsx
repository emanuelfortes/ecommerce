"use client";

import clsx from "clsx";
import { useStore } from "@/components/providers/StoreProvider";
import { installments, pixPrice } from "@/lib/format";

export function Money({ value, className }: { value: number; className?: string }) {
  const { money } = useStore();
  return <span className={clsx("tabular-nums", className)}>{money(value)}</span>;
}

export function Price({
  price,
  oldPrice,
  size = "sm",
  showInstallments,
  showPix,
}: {
  price: number;
  oldPrice?: number;
  size?: "sm" | "lg";
  showInstallments?: boolean;
  showPix?: boolean;
}) {
  const { money } = useStore();
  const inst = installments(price);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-baseline gap-2">
        {oldPrice && (
          <span className={clsx("text-taupe line-through", size === "lg" ? "text-base" : "text-xs")}>{money(oldPrice)}</span>
        )}
        <span className={clsx("tabular-nums text-ink", size === "lg" ? "font-serif text-4xl" : "text-[15px] font-medium")}>
          {money(price)}
        </span>
      </div>
      {showInstallments && (
        <span className="text-xs text-taupe">
          ou {inst.n}x de {money(inst.each)} sem juros
        </span>
      )}
      {showPix && (
        <span className="text-xs text-graphite">
          <span className="text-gold">◆</span> {money(pixPrice(price))} no PIX (5% off)
        </span>
      )}
    </div>
  );
}
