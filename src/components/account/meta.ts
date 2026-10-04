import type { Metadata } from "next";

/** Metadata para páginas privadas da conta (não indexadas). */
export function privateMeta(title: string, description?: string): Metadata {
  return { title, description, robots: { index: false, follow: false } };
}

/** Cliente de demonstração exibida quando ninguém está logado. */
export const demoUser = {
  name: "Karen Michelly",
  email: "karen@karenmichelly.com.br",
  cpf: "123.456.789-09",
  phone: "(11) 98765-4321",
  birth: "1988-05-14",
  gender: "Feminino",
  since: "2023-03-12",
  size: "P",
  shoe: "36",
};
