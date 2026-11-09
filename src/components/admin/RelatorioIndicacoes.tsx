import { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { nomeLoja, rotuloCategoria, type ProdutoIndicado } from "@/lib/indicacoes";

type Clique = { id: string; produto_id: string; created_at: string };
type Grupo = { nome: string; quantidade: number };

const dataInput = (data: Date) => {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
};

const csvCell = (valor: string | number) => `"${String(valor).replace(/"/g, '""')}"`;

const RelatorioIndicacoes = ({ produtos }: { produtos: ProdutoIndicado[] }) => {
  const [fim, setFim] = useState(() => dataInput(new Date()));
  const [inicio, setInicio] = useState(() => {
    const data = new Date();
    data.setDate(data.getDate() - 29);
    return dataInput(data);
  });
  const [cliques, setCliques] = useState<Clique[]>([]);
  const [loading, setLoading] = useState(false);

  const carregar = async () => {
    if (!inicio || !fim || inicio > fim) {
      toast.error("Escolha um período válido.");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("cliques_indicacoes")
      .select("id, produto_id, created_at")
      .gte("created_at", new Date(`${inicio}T00:00:00`).toISOString())
      .lte("created_at", new Date(`${fim}T23:59:59.999`).toISOString())
      .order("created_at", { ascending: false })
      .limit(10000);
    setLoading(false);
    if (error) {
      toast.error("Não foi possível carregar o relatório.");
      return;
    }
    setCliques(data ?? []);
  };

  useEffect(() => {
    void carregar();
    // O carregamento inicial usa o período padrão; mudanças são aplicadas pelo botão.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const grupos = useMemo(() => {
    const porProduto = new Map<string, number>();
    const porLoja = new Map<string, number>();
    const porCategoria = new Map<string, number>();
    cliques.forEach((clique) => {
      const produto = produtos.find((item) => item.id === clique.produto_id);
      if (!produto) return;
      porProduto.set(produto.nome, (porProduto.get(produto.nome) ?? 0) + 1);
      const loja = nomeLoja(produto);
      porLoja.set(loja, (porLoja.get(loja) ?? 0) + 1);
      const categoria = rotuloCategoria(produto.categoria);
      porCategoria.set(categoria, (porCategoria.get(categoria) ?? 0) + 1);
    });
    const ordenar = (mapa: Map<string, number>): Grupo[] => Array.from(mapa, ([nome, quantidade]) => ({ nome, quantidade })).sort((a, b) => b.quantidade - a.quantidade || a.nome.localeCompare(b.nome, "pt-BR"));
    return [
      { titulo: "Por produto", dados: ordenar(porProduto) },
      { titulo: "Por loja", dados: ordenar(porLoja) },
      { titulo: "Por categoria", dados: ordenar(porCategoria) },
    ];
  }, [cliques, produtos]);

  const exportar = () => {
    const linhas = grupos.flatMap((grupo) => grupo.dados.map((item) => [grupo.titulo.replace("Por ", ""), item.nome, item.quantidade]));
    const cabecalho = ["Dimensão", "Item", "Cliques"];
    const csv = `\uFEFF${[cabecalho, ...linhas].map((linha) => linha.map(csvCell).join(";")).join("\r\n")}`;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio-indicacoes-${inicio}-a-${fim}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="mt-8">
      <div className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6">
        <div className="grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-[180px_180px_auto_auto]">
          <label className="text-sm text-espresso/70">Início<input type="date" value={inicio} onChange={(event) => setInicio(event.target.value)} className="mt-2 w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm text-espresso" /></label>
          <label className="text-sm text-espresso/70">Fim<input type="date" value={fim} onChange={(event) => setFim(event.target.value)} className="mt-2 w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm text-espresso" /></label>
          <button type="button" onClick={() => void carregar()} disabled={loading} className="btn-wine !py-2.5">{loading ? "Carregando…" : "Aplicar período"}</button>
          <button type="button" onClick={exportar} disabled={!cliques.length} className="btn-outline-wine !py-2.5 disabled:opacity-50"><Download className="h-4 w-4" /> Exportar CSV</button>
        </div>
        <p className="mt-4 text-sm text-espresso/60">{cliques.length} {cliques.length === 1 ? "clique no período" : "cliques no período"}</p>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {grupos.map((grupo) => (
          <div key={grupo.titulo} className="rounded-3xl border border-border/70 bg-card p-5">
            <h2 className="font-serif text-2xl text-espresso">{grupo.titulo}</h2>
            {grupo.dados.length ? (
              <ul className="mt-4 divide-y divide-border/70">
                {grupo.dados.map((item) => (
                  <li key={item.nome} className="flex items-start justify-between gap-3 py-3 text-sm">
                    <span className="text-espresso/75">{item.nome}</span>
                    <strong className="shrink-0 font-medium text-wine">{item.quantidade}</strong>
                  </li>
                ))}
              </ul>
            ) : <p className="mt-4 text-sm text-espresso/50">Nenhum clique no período.</p>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatorioIndicacoes;
