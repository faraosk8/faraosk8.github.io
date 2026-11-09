import { z } from "zod";

export const programasSociais = ["Bolsa Família", "BPC", "Inscrita no CadÚnico", "Outro"] as const;
export const preferenciasContato = ["Sim", "Prefiro que liguem", "Prefiro outro contato"] as const;

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
    via_programa_social: z.boolean(),
    via_vulnerabilidade: z.boolean(),
    programas_sociais: z.array(z.enum(programasSociais)).max(4),
    programa_outro: z.string().trim().max(120, "Use no máximo 120 caracteres."),
    declaracao_beneficiario: z.boolean(),
    preferencia_contato: z.enum(preferenciasContato),
    contato_alternativo: z.string().trim().max(200, "Use no máximo 200 caracteres."),
    melhor_horario: z.string().trim().max(120, "Use no máximo 120 caracteres."),
    motivo: z.string().trim().min(1, "Conte por que você gostaria de participar.").max(600, "Use no máximo 600 caracteres."),
    nome_responsavel: z.string().trim().max(120, "Use no máximo 120 caracteres."),
    telefone_responsavel: z.string(),
    autorizacao_responsavel: z.boolean(),
    consentimento_lgpd: z.boolean().refine((value) => value, "É necessário concordar com o uso dos dados para enviar a inscrição."),
  })
  .superRefine((data, context) => {
    if (!data.via_programa_social && !data.via_vulnerabilidade) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["via_programa_social"],
        message: "Selecione pelo menos uma opção para participar.",
      });
    }

    if (data.via_programa_social) {
      if (data.programas_sociais.length === 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["programas_sociais"],
          message: "Selecione pelo menos um programa social.",
        });
      }
      if (data.programas_sociais.includes("Outro") && data.programa_outro.length < 2) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["programa_outro"],
          message: "Informe qual é o outro programa social.",
        });
      }
      if (!data.declaracao_beneficiario) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["declaracao_beneficiario"],
          message: "Confirme a declaração e o compromisso de apresentar o comprovante.",
        });
      }
    }

    if (data.preferencia_contato === "Prefiro outro contato" && data.contato_alternativo.length < 2) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["contato_alternativo"],
        message: "Informe como você prefere ser contatada.",
      });
    }

    if (data.idade < 18) {
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
    }
  });

export type InscricaoFormState = {
  nome: string;
  idade: string;
  telefone: string;
  email: string;
  bairro: string;
  cidade: string;
  via_programa_social: boolean;
  via_vulnerabilidade: boolean;
  programas_sociais: Array<(typeof programasSociais)[number]>;
  programa_outro: string;
  declaracao_beneficiario: boolean;
  preferencia_contato: (typeof preferenciasContato)[number];
  contato_alternativo: string;
  melhor_horario: string;
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
  via_programa_social: false,
  via_vulnerabilidade: false,
  programas_sociais: [],
  programa_outro: "",
  declaracao_beneficiario: false,
  preferencia_contato: "Sim",
  contato_alternativo: "",
  melhor_horario: "",
  motivo: "",
  nome_responsavel: "",
  telefone_responsavel: "",
  autorizacao_responsavel: false,
  consentimento_lgpd: false,
};

export const getViaEntrada = (viaPrograma: boolean, viaVulnerabilidade: boolean) => {
  if (viaPrograma && viaVulnerabilidade) return "Ambos";
  if (viaPrograma) return "Programa social";
  if (viaVulnerabilidade) return "Vulnerabilidade";
  return "Não informada";
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
