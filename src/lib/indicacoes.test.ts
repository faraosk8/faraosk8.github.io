// @ts-expect-error O runner de testes Bun fornece este módulo em tempo de execução.
import { describe, expect, test } from "bun:test";
import {
  cupomDisponivel,
  exibirPreco,
  filtrarProdutos,
  filtrosDaUrl,
  filtrosIniciais,
  origemSemDadosPessoais,
  precoDesatualizado,
  type ProdutoIndicado,
} from "./indicacoes";

const produtoBase: ProdutoIndicado = {
  id: "1",
  created_at: "2026-11-01T12:00:00Z",
  updated_at: "2026-11-01T12:00:00Z",
  nome: "Produto teste",
  slug: "produto-teste",
  imagem_url: null,
  loja: "amazon",
  loja_outra_nome: null,
  link_afiliado: "https://exemplo.com/produto",
  categoria: "skincare",
  necessidades: ["pele-sensivel"],
  por_que_indico: "Indicação de teste.",
  preco: 89.9,
  preco_anterior: 99.9,
  preco_verificado_em: "2026-11-01",
  cupom: null,
  cupom_validade: null,
  favorito: false,
  destaque_home: false,
  ordem: 0,
  ativo: true,
};

describe("regras comerciais das indicações", () => {
  test("nunca exibe preço de produto da Amazon", () => {
    expect(exibirPreco(produtoBase)).toBe(false);
    expect(exibirPreco({ ...produtoBase, loja: "shopee" })).toBe(true);
  });

  test("oculta cupom depois do último dia de validade", () => {
    const produto = { ...produtoBase, cupom: "CUIDADO10", cupom_validade: "2026-11-08" };
    expect(cupomDisponivel(produto, new Date("2026-11-08T23:59:00"))).toBe(true);
    expect(cupomDisponivel(produto, new Date("2026-11-09T00:00:00"))).toBe(false);
  });

  test("alerta somente quando o preço foi verificado há mais de 15 dias", () => {
    const agora = new Date("2026-11-20T12:00:00");
    expect(precoDesatualizado({ preco_verificado_em: "2026-11-05" }, agora)).toBe(false);
    expect(precoDesatualizado({ preco_verificado_em: "2026-11-04" }, agora)).toBe(true);
  });

  test("mantém somente a origem do referrer, sem caminho ou parâmetros", () => {
    expect(origemSemDadosPessoais("https://instagram.com/perfil?visitante=dado-pessoal")).toBe("https://instagram.com");
  });
});

describe("filtros compartilháveis", () => {
  test("lê categoria, loja e necessidades da URL", () => {
    const filtros = filtrosDaUrl(new URLSearchParams("categoria=skincare&loja=amazon&necessidades=queda,manchas"));
    expect(filtros.categoria).toBe("skincare");
    expect(filtros.loja).toBe("amazon");
    expect(filtros.necessidades).toEqual(["queda", "manchas"]);
  });

  test("busca por nome sem diferenciar acentos", () => {
    const produtos = [{ ...produtoBase, nome: "Loção pós-procedimento" }];
    const resultado = filtrarProdutos(produtos, { ...filtrosIniciais, busca: "pos procedimento" });
    expect(resultado).toHaveLength(1);
  });

  test("ordena por menor preço e deixa produtos sem preço ao final", () => {
    const produtos = [
      { ...produtoBase, id: "amazon", preco: 10 },
      { ...produtoBase, id: "caro", loja: "shopee", preco: 100 },
      { ...produtoBase, id: "barato", loja: "magalu", preco: 30 },
    ];
    const resultado = filtrarProdutos(produtos, { ...filtrosIniciais, ordem: "menor-preco" });
    expect(resultado.map((item) => item.id)).toEqual(["barato", "caro", "amazon"]);
  });
});
