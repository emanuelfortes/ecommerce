export type Currency = "BRL" | "USD" | "EUR";
export type Locale = "pt-BR" | "en" | "es";

/** Taxas fixas apenas para demonstração. Em produção, busque de uma API. */
export const rates: Record<Currency, number> = { BRL: 1, USD: 0.18, EUR: 0.165 };

export const currencyLocale: Record<Currency, string> = {
  BRL: "pt-BR",
  USD: "en-US",
  EUR: "de-DE",
};

export function formatMoney(value: number, currency: Currency = "BRL") {
  return new Intl.NumberFormat(currencyLocale[currency], {
    style: "currency",
    currency,
  }).format(value * rates[currency]);
}

export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions) {
  return new Date(iso + "T12:00:00").toLocaleDateString(
    "pt-BR",
    opts ?? { day: "2-digit", month: "long", year: "numeric" }
  );
}

export function installments(value: number, max = 6) {
  const n = Math.min(max, Math.max(1, Math.floor(value / 60)));
  return { n, each: value / n };
}

export const pixPrice = (value: number) => value * 0.95;
