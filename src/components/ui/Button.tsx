import Link from "next/link";
import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "gold" | "light";

const variants: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  gold: "btn-gold",
  light: "btn-light",
};

interface Common {
  variant?: Variant;
  size?: "md" | "sm";
  full?: boolean;
  className?: string;
  children: ReactNode;
}

type AsButton = Common & Omit<ComponentProps<"button">, "className" | "children"> & { href?: undefined };
type AsLink = Common & Omit<ComponentProps<typeof Link>, "className" | "children"> & { href: string };

/** Botão Principal (preto → dourado) e Botão Secundário (contorno → preto), conforme a paleta. */
export function Button(props: AsButton | AsLink) {
  const { variant = "primary", size = "md", full, className, children, ...rest } = props;
  const cls = clsx(variants[variant], size === "sm" && "btn-sm", full && "w-full", className);
  if ("href" in rest && rest.href !== undefined) {
    return (
      <Link className={cls} {...(rest as Omit<AsLink, keyof Common>)}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...(rest as Omit<AsButton, keyof Common>)}>
      {children}
    </button>
  );
}
