import { z } from "zod";

export const inscricaoSchema = z
  .object({
    nome: z.string().trim().min(3, "Informe seu nome completo.").max(120, "Use no máximo 120 caracteres."),
    idade: z
      .string()
      .trim()
      .regex(/^\d+$/, "Informe uma idade válida, usando apenas números.")
      .transform(Number)
      .pipe(z.number().int().min(1, "Informe uma idade válida.").max(120, "Informe uma idade válida.")),
    telefone: z.string().refine((value) => value.replace(/\D/g, "").length === 11, "Informe o telefone com DDD e 9 dígitos."),
    email: z.union([
      z.literal(""),
      z.string().trim().email("Informe um e-mail válido.").max(255, "Use no máximo 255 caracteres."),
    ]),
    bairro: z.string().trim().min(2, "Informe seu bairro.").max(100, "Use no máximo 100 caracteres."),
    cidade: z.string().trim().min(2, "Informe sua cidade.").max(100, "Use no máximo 100 caracteres."),
    motivo: z.string().trim().min(1, "Conte por que você gostaria de participar.").max(600, "Use no máximo 600 caracteres."),
    nome_responsavel: z.string().trim().max(120, "Use no máximo 120 caracteres."),
    telefone_responsavel: z.string(),
    autorizacao_responsavel: z.boolean(),
    consentimento_lgpd: z.boolean().refine((value) => value, "É necessário concordar com o uso dos dados para enviar a inscrição."),
  })
  .superRefine((data, context) => {
    if (data.idade >= 18) return;

    if (data.nome_responsavel.length < 3) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["nome_responsavel"],
        message: "Informe o nome completo do responsável.",
      });
    }
    if (data.telefone_responsavel.replace(/\D/g, "").length !== 11) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["telefone_responsavel"],
        message: "Informe o telefone do responsável com DDD e 9 dígitos.",
      });
    }
    if (!data.autorizacao_responsavel) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["autorizacao_responsavel"],
        message: "A autorização do responsável é obrigatória para menores de 18 anos.",
      });
    }
  });

export type InscricaoFormState = {
  nome: string;
  idade: string;
  telefone: string;
  email: string;
  bairro: string;
  cidade: string;
  motivo: string;
  nome_responsavel: string;
  telefone_responsavel: string;
  autorizacao_responsavel: boolean;
  consentimento_lgpd: boolean;
};

export const inscricaoInicial: InscricaoFormState = {
  nome: "",
  idade: "",
  telefone: "",
  email: "",
  bairro: "",
  cidade: "Fortaleza",
  motivo: "",
  nome_responsavel: "",
  telefone_responsavel: "",
  autorizacao_responsavel: false,
  consentimento_lgpd: false,
};

export const formatTelefone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";

  const ddd = digits.slice(0, 2);
  const primeiro = digits.slice(2, 3);
  const meio = digits.slice(3, 7);
  const final = digits.slice(7, 11);
  let formatted = `(${ddd}) ${primeiro}`;
  if (digits.length > 3) formatted += ` ${meio}`;
  if (digits.length > 7) formatted += `-${final}`;
  return formatted;
};

export const getSessionId = () => {
  const key = "olhar-cuidado-sessao";
  try {
    const saved = window.localStorage.getItem(key);
    if (saved) return saved;
    const created = window.crypto.randomUUID();
    window.localStorage.setItem(key, created);
    return created;
  } catch {
    return window.crypto.randomUUID();
  }
};
