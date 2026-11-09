import { z } from "zod";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type ProdutoIndicado = Tables<"produtos_indicados">;
export type Loja = ProdutoIndicado["loja"];
export type Categoria = ProdutoIndicado["categoria"];
export type PaginaClique = "home" | "indicacoes" | "filtro_aplicado";
export type Ordenacao = "destaques" | "recentes" | "menor-preco";

export const CATEGORIAS = [
  { value: "cabelo-couro-cabeludo", label: "Cabelo e couro cabeludo" },
  { value: "skincare", label: "Skincare" },
  { value: "protecao-solar", label: "Proteção solar" },
  { value: "corpo", label: "Corpo" },
  { value: "acessorios-ferramentas", label: "Acessórios e ferramentas" },
] as const;

export const NECESSIDADES = [
  { value: "queda", label: "Queda" },
  { value: "oleosidade", label: "Oleosidade" },
  { value: "caspa", label: "Caspa" },
  { value: "ressecamento", label: "Ressecamento" },
  { value: "pele-acneica", label: "Pele acneica" },
  { value: "pele-sensivel", label: "Pele sensível" },
  { value: "manchas", label: "Manchas" },
  { value: "pos-procedimento", label: "Pós-procedimento" },
] as const;

export const LOJAS = [
  { value: "amazon", label: "Amazon" },
  { value: "mercado_livre", label: "Mercado Livre" },
  { value: "shopee", label: "Shopee" },
  { value: "magalu", label: "Magalu" },
  { value: "outra", label: "Outras" },
] as const;

export type FiltrosIndicacoes = {
  busca: string;
  categoria: string;
  loja: string;
  necessidades: string[];
  ordem: Ordenacao;
};

const categoriasValidas = new Set<string>(CATEGORIAS.map((item) => item.value));
const lojasValidas = new Set<string>(LOJAS.map((item) => item.value));
const necessidadesValidas = new Set<string>(NECESSIDADES.map((item) => item.value));
const ordenacoesValidas = new Set<string>(["destaques", "recentes", "menor-preco"]);

export const filtrosIniciais: FiltrosIndicacoes = {
  busca: "",
  categoria: "todos",
  loja: "todas",
  necessidades: [],
  ordem: "destaques",
};

export function filtrosDaUrl(params: URLSearchParams): FiltrosIndicacoes {
  const categoria = params.get("categoria") ?? "todos";
  const loja = params.get("loja") ?? "todas";
  const ordem = params.get("ordem") ?? "destaques";
  const necessidades = (params.get("necessidades") ?? "")
    .split(",")
    .filter((item, index, all) => necessidadesValidas.has(item) && all.indexOf(item) === index);

  return {
    busca: (params.get("busca") ?? "").slice(0, 120),
    categoria: categoriasValidas.has(categoria) ? categoria : "todos",
    loja: lojasValidas.has(loja) ? loja : "todas",
    necessidades,
    ordem: ordenacoesValidas.has(ordem) ? (ordem as Ordenacao) : "destaques",
  };
}

export function temFiltroAplicado(filtros: FiltrosIndicacoes) {
  return Boolean(
    filtros.busca.trim() ||
      filtros.categoria !== "todos" ||
      filtros.loja !== "todas" ||
      filtros.necessidades.length,
  );
}

const normalizar = (valor: string) =>
  valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");

export function filtrarProdutos(produtos: ProdutoIndicado[], filtros: FiltrosIndicacoes) {
  const termo = normalizar(filtros.busca.trim());
  const filtrados = produtos.filter((produto) => {
    const nome = normalizar(produto.nome);
    return (
      (!termo || nome.includes(termo)) &&
      (filtros.categoria === "todos" || produto.categoria === filtros.categoria) &&
      (filtros.loja === "todas" || produto.loja === filtros.loja) &&
      (!filtros.necessidades.length || filtros.necessidades.some((item) => produto.necessidades.includes(item)))
    );
  });

  return [...filtrados].sort((a, b) => {
    if (filtros.ordem === "recentes") return b.created_at.localeCompare(a.created_at);
    if (filtros.ordem === "menor-preco") {
      const precoA = exibirPreco(a) ? Number(a.preco) : Number.POSITIVE_INFINITY;
      const precoB = exibirPreco(b) ? Number(b.preco) : Number.POSITIVE_INFINITY;
      return precoA - precoB || a.ordem - b.ordem;
    }
    return (
      Number(b.destaque_home) - Number(a.destaque_home) ||
      Number(b.favorito) - Number(a.favorito) ||
      a.ordem - b.ordem ||
      b.created_at.localeCompare(a.created_at)
    );
  });
}

export function slugify(texto: string) {
  return normalizar(texto)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 90);
}

export function nomeLoja(produto: Pick<ProdutoIndicado, "loja" | "loja_outra_nome">) {
  if (produto.loja === "outra") return produto.loja_outra_nome?.trim() || "Outra loja";
  return LOJAS.find((item) => item.value === produto.loja)?.label ?? "Loja";
}

export function rotuloCategoria(categoria: string) {
  return CATEGORIAS.find((item) => item.value === categoria)?.label ?? categoria;
}

export function rotuloNecessidade(necessidade: string) {
  return NECESSIDADES.find((item) => item.value === necessidade)?.label ?? necessidade;
}

export function textoBotaoLoja(produto: Pick<ProdutoIndicado, "loja" | "loja_outra_nome">) {
  if (produto.loja === "amazon") return "Ver na Amazon";
  if (produto.loja === "mercado_livre") return "Ver no Mercado Livre";
  if (produto.loja === "outra") return produto.loja_outra_nome ? `Ver na ${produto.loja_outra_nome}` : "Ver na loja";
  return `Ver na ${nomeLoja(produto)}`;
}

export function exibirPreco(produto: Pick<ProdutoIndicado, "loja" | "preco">) {
  return produto.loja !== "amazon" && produto.preco !== null;
}

export function cupomDisponivel(
  produto: Pick<ProdutoIndicado, "cupom" | "cupom_validade">,
  agora = new Date(),
) {
  if (!produto.cupom?.trim()) return false;
  if (!produto.cupom_validade) return true;
  const validade = new Date(`${produto.cupom_validade}T23:59:59.999`);
  return !Number.isNaN(validade.getTime()) && validade >= agora;
}

export function precoDesatualizado(produto: Pick<ProdutoIndicado, "preco_verificado_em">, agora = new Date()) {
  if (!produto.preco_verificado_em) return false;
  const verificado = new Date(`${produto.preco_verificado_em}T12:00:00`);
  const limite = new Date(agora);
  limite.setDate(limite.getDate() - 15);
  return verificado < limite;
}

export function formatarPreco(valor: number | string) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(valor));
}

export function formatarDataCurta(data: string) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}`;
}

export function origemSemDadosPessoais(referrer: string) {
  if (!referrer) return null;
  try {
    return new URL(referrer).origin.slice(0, 200);
  } catch {
    return null;
  }
}

export const produtoFormSchema = z.object({
  nome: z.string().trim().min(2, "Informe o nome do produto.").max(160),
  slug: z.string().trim().min(2, "Informe o endereço do produto.").max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífens."),
  imagem_url: z.string().nullable(),
  loja: z.enum(["amazon", "mercado_livre", "shopee", "magalu", "outra"]),
  loja_outra_nome: z.string().trim().max(80),
  link_afiliado: z.string().trim().url("Informe um link válido.").max(1500).refine((valor) => ["http:", "https:"].includes(new URL(valor).protocol), "O link deve usar http ou https."),
  categoria: z.enum(["cabelo-couro-cabeludo", "skincare", "protecao-solar", "corpo", "acessorios-ferramentas"]),
  necessidades: z.array(z.enum(["queda", "oleosidade", "caspa", "ressecamento", "pele-acneica", "pele-sensivel", "manchas", "pos-procedimento"])).max(8),
  por_que_indico: z.string().trim().max(160, "Use no máximo 160 caracteres."),
  preco: z.string().trim(),
  preco_anterior: z.string().trim(),
  preco_verificado_em: z.string(),
  cupom: z.string().trim().max(80),
  cupom_validade: z.string(),
  favorito: z.boolean(),
  destaque_home: z.boolean(),
  ordem: z.number().int().min(0).max(999999),
  ativo: z.boolean(),
}).superRefine((form, contexto) => {
  if (form.loja === "outra" && !form.loja_outra_nome) {
    contexto.addIssue({ code: z.ZodIssueCode.custom, path: ["loja_outra_nome"], message: "Informe o nome da loja." });
  }
  for (const campo of ["preco", "preco_anterior"] as const) {
    const valor = form[campo];
    if (valor && (!Number.isFinite(Number(valor.replace(",", "."))) || Number(valor.replace(",", ".")) < 0)) {
      contexto.addIssue({ code: z.ZodIssueCode.custom, path: [campo], message: "Informe um valor válido." });
    }
  }
  if (form.preco && !form.preco_verificado_em) {
    contexto.addIssue({ code: z.ZodIssueCode.custom, path: ["preco_verificado_em"], message: "Informe a data da verificação do preço." });
  }
});

export type ProdutoForm = z.input<typeof produtoFormSchema>;

export const formularioProdutoVazio: ProdutoForm = {
  nome: "",
  slug: "",
  imagem_url: null,
  loja: "amazon",
  loja_outra_nome: "",
  link_afiliado: "",
  categoria: "cabelo-couro-cabeludo",
  necessidades: [],
  por_que_indico: "",
  preco: "",
  preco_anterior: "",
  preco_verificado_em: "",
  cupom: "",
  cupom_validade: "",
  favorito: false,
  destaque_home: false,
  ordem: 0,
  ativo: true,
};

export function produtoParaFormulario(produto: ProdutoIndicado): ProdutoForm {
  return {
    nome: produto.nome,
    slug: produto.slug,
    imagem_url: produto.imagem_url,
    loja: produto.loja,
    loja_outra_nome: produto.loja_outra_nome ?? "",
    link_afiliado: produto.link_afiliado,
    categoria: produto.categoria,
    necessidades: produto.necessidades as ProdutoForm["necessidades"],
    por_que_indico: produto.por_que_indico,
    preco: produto.preco?.toString() ?? "",
    preco_anterior: produto.preco_anterior?.toString() ?? "",
    preco_verificado_em: produto.preco_verificado_em ?? "",
    cupom: produto.cupom ?? "",
    cupom_validade: produto.cupom_validade ?? "",
    favorito: produto.favorito,
    destaque_home: produto.destaque_home,
    ordem: produto.ordem,
    ativo: produto.ativo,
  };
}

export function formularioParaProduto(form: ProdutoForm): TablesInsert<"produtos_indicados"> {
  const validado = produtoFormSchema.parse(form);
  const numero = (valor: string) => valor ? Number(valor.replace(",", ".")) : null;
  return {
    nome: validado.nome,
    slug: validado.slug,
    imagem_url: validado.imagem_url,
    loja: validado.loja,
    loja_outra_nome: validado.loja === "outra" ? validado.loja_outra_nome : null,
    link_afiliado: validado.link_afiliado,
    categoria: validado.categoria,
    necessidades: validado.necessidades,
    por_que_indico: validado.por_que_indico,
    preco: numero(validado.preco),
    preco_anterior: numero(validado.preco_anterior),
    preco_verificado_em: validado.preco_verificado_em || null,
    cupom: validado.cupom || null,
    cupom_validade: validado.cupom_validade || null,
    favorito: validado.favorito,
    destaque_home: validado.destaque_home,
    ordem: validado.ordem,
    ativo: validado.ativo,
  };
}
