// @ts-expect-error O runner de testes Bun fornece este módulo em tempo de execução.
import { describe, expect, test } from "bun:test";
import { inscricaoInicial, inscricaoSchema } from "./olhar-cuidado";

const inscricaoValida = {
  ...inscricaoInicial,
  nome: "Maria da Silva",
  idade: "35",
  telefone: "(85) 9 9999-9999",
  bairro: "Aldeota",
  via_programa_social: true,
  programas_sociais: ["Bolsa Família" as const],
  declaracao_beneficiario: true,
  motivo: "Gostaria de receber o atendimento.",
  consentimento_lgpd: true,
};

describe("regras de elegibilidade e contato", () => {
  test("exige pelo menos uma via de entrada", () => {
    const result = inscricaoSchema.safeParse({ ...inscricaoValida, via_programa_social: false, programas_sociais: [], declaracao_beneficiario: false });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) => issue.path[0] === "via_programa_social")).toBe(true);
  });

  test("exige programa e declaração para inscrição por programa social", () => {
    const result = inscricaoSchema.safeParse({ ...inscricaoValida, programas_sociais: [], declaracao_beneficiario: false });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) => issue.path[0] === "programas_sociais")).toBe(true);
    expect(result.error?.issues.some((issue) => issue.path[0] === "declaracao_beneficiario")).toBe(true);
  });

  test("exige o nome quando Outro programa é selecionado", () => {
    const result = inscricaoSchema.safeParse({ ...inscricaoValida, programas_sociais: ["Outro" as const], programa_outro: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) => issue.path[0] === "programa_outro")).toBe(true);
  });

  test("exige contato alternativo apenas para a preferência correspondente", () => {
    const result = inscricaoSchema.safeParse({ ...inscricaoValida, preferencia_contato: "Prefiro outro contato" as const, contato_alternativo: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) => issue.path[0] === "contato_alternativo")).toBe(true);
  });
});
