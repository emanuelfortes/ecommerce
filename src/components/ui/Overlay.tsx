"use client";

import clsx from "clsx";
import { X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

/** Controla montagem/desmontagem com transição de entrada e saída. */
function usePresence(open: boolean, ms = 450) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (open) {
      setMounted(true);
      const r = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      return () => cancelAnimationFrame(r);
    }
    setVisible(false);
    const t = window.setTimeout(() => setMounted(false), ms);
    return () => window.clearTimeout(t);
  }, [open, ms]);
  return { mounted, visible };
}

export function Backdrop({ visible, onClick }: { visible: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "fixed inset-0 z-[60] bg-ink/50 backdrop-blur-[2px] transition-opacity duration-500",
        visible ? "opacity-100" : "opacity-0"
      )}
      aria-hidden
    />
  );
}

export function CloseButton({ onClick, className, label = "Fechar" }: { onClick: () => void; className?: string; label?: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={clsx("grid size-10 place-items-center text-current transition-colors hover:text-gold", className)}
    >
      <X className="size-5" strokeWidth={1.2} />
    </button>
  );
}

/* ---------- Drawer lateral ---------- */
export function Drawer({
  open,
  onClose,
  side = "right",
  title,
  children,
  footer,
  width = "max-w-md",
  dark,
}: {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right";
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  width?: string;
  dark?: boolean;
}) {
  const { mounted, visible } = usePresence(open);
  if (!mounted) return null;
  return (
    <>
      <Backdrop visible={visible} onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        className={clsx(
          "fixed inset-y-0 z-[70] flex w-full flex-col shadow-2xl transition-transform duration-500 ease-[var(--ease-luxe)]",
          width,
          dark ? "bg-ink text-offwhite" : "bg-offwhite text-graphite",
          side === "right" ? "right-0" : "left-0",
          visible ? "translate-x-0" : side === "right" ? "translate-x-full" : "-translate-x-full"
        )}
      >
        {title !== undefined && (
          <header className={clsx("flex items-center justify-between border-b px-6 py-4", dark ? "border-white/10" : "border-line")}>
            <div className="font-serif text-2xl">{title}</div>
            <CloseButton onClick={onClose} className="-mr-2" />
          </header>
        )}
        <div className="flex-1 overflow-y-auto">{children}</div>
        {footer && <footer className={clsx("border-t px-6 py-5", dark ? "border-white/10" : "border-line bg-white")}>{footer}</footer>}
      </aside>
    </>
  );
}

/* ---------- Modal central ---------- */
export function Modal({
  open,
  onClose,
  children,
  size = "md",
  className,
  bare,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  bare?: boolean;
}) {
  const { mounted, visible } = usePresence(open, 350);
  if (!mounted) return null;
  return (
    <>
      <Backdrop visible={visible} onClick={onClose} />
      <div className="pointer-events-none fixed inset-0 z-[70] grid place-items-center overflow-y-auto p-4">
        <div
          role="dialog"
          aria-modal="true"
          className={clsx(
            "pointer-events-auto relative w-full bg-offwhite shadow-2xl transition-all duration-500 ease-[var(--ease-luxe)]",
            size === "sm" && "max-w-sm",
            size === "md" && "max-w-lg",
            size === "lg" && "max-w-3xl",
            size === "xl" && "max-w-5xl",
            visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            className
          )}
        >
          {!bare && <CloseButton onClick={onClose} className="absolute right-2 top-2 z-10" />}
          {children}
        </div>
      </div>
    </>
  );
}
