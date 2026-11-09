import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, CalendarCheck, RotateCcw, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { WHATSAPP_URL } from "@/components/Navbar";
import { useProductImages } from "@/hooks/use-product-images";
import {
  CATEGORIAS,
  LOJAS,
  NECESSIDADES,
  filtrarProdutos,
  filtrosDaUrl,
  temFiltroAplicado,
  type ProdutoIndicado,
} from "@/lib/indicacoes";

const chipBase = "rounded-full border px-3.5 py-2 text-xs transition-colors sm:text-sm";
const chipAtivo = "border-wine bg-wine text-primary-foreground";
const chipInativo = "border-wine/20 bg-card text-espresso/70 hover:border-wine/50 hover:text-wine";

const Indicacoes = () => {
  const [produtos, setProdutos] = useState<ProdutoIndicado[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const filtros = useMemo(() => filtrosDaUrl(searchParams), [searchParams]);
  const filtrados = useMemo(() => filtrarProdutos(produtos, filtros), [produtos, filtros]);
  const imagens = useProductImages(filtrados);
  const paginaClique = temFiltroAplicado(filtros) ? "filtro_aplicado" : "indicacoes";

  useEffect(() => {
    const tituloAnterior = document.title;
    const descricao = document.querySelector('meta[name="description"]');
    const descricaoAnterior = descricao?.getAttribute("content") ?? "";
    document.title = "Indicações da Fernanda | Produtos para cabelo e pele";
    descricao?.setAttribute("content", "Produtos para cabelo, couro cabeludo e pele que a Fernanda Rabelo usa e indica. Links para Amazon, Mercado Livre e outras lojas.");
    return () => {
      document.title = tituloAnterior;
      descricao?.setAttribute("content", descricaoAnterior);
    };
  }, []);

  useEffect(() => {
    supabase
      .from("produtos_indicados")
      .select("*")
      .eq("ativo", true)
      .order("ordem", { ascending: true })
      .then(({ data }) => {
        setProdutos(data ?? []);
        setLoading(false);
      });
  }, []);

  const alterarFiltro = (chave: string, valor: string, valorPadrao = "") => {
    const novos = new URLSearchParams(searchParams);
    if (!valor || valor === valorPadrao) novos.delete(chave);
    else novos.set(chave, valor);
    setSearchParams(novos, { replace: true });
  };

  const alternarNecessidade = (valor: string) => {
    const necessidades = filtros.necessidades.includes(valor)
      ? filtros.necessidades.filter((item) => item !== valor)
      : [...filtros.necessidades, valor];
    alterarFiltro("necessidades", necessidades.join(","));
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-background">
      <Navbar />
      <section className="section-padding pt-28 md:pt-32">
        <div className="container mx-auto max-w-[1440px]">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-espresso/60 transition-colors hover:text-wine">
            <ArrowLeft className="h-4 w-4" /> Voltar para o início
          </Link>

          <header className="mx-auto mt-8 max-w-3xl text-center">
            <span className="eyebrow">Curadoria da clínica</span>
            <h1 className="mt-3 font-serif text-4xl text-espresso md:text-5xl">Indicações da Fernanda</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-espresso/75 sm:text-base">
              Produtos que uso, conheço e indico no dia a dia da clínica. Os links abaixo levam para lojas parceiras.
            </p>
            <div className="mt-6 rounded-2xl border border-gold/30 bg-sand/55 p-4 text-left sm:p-5">
              <p className="text-xs leading-relaxed text-espresso/75 sm:text-sm">
                <strong className="font-medium text-espresso">Transparência:</strong> Alguns links desta página são de afiliados. Se você comprar por eles, posso receber uma comissão, sem custo extra para você. Como associada da Amazon, recebo por compras qualificadas.
              </p>
            </div>
            <div className="mt-5 rounded-2xl bg-blush/55 p-4 sm:p-5">
              <p className="text-xs leading-relaxed text-espresso/65">
                As indicações são orientações gerais e não substituem uma avaliação individual. Para queda de cabelo ou alterações no couro cabeludo, agende sua avaliação capilar.
              </p>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-outline-wine mt-4 !py-2.5 text-xs">
                <CalendarCheck className="h-4 w-4" /> Agendar avaliação
              </a>
            </div>
          </header>

          <section aria-label="Filtros de produtos" className="mt-12 rounded-3xl border border-border/70 bg-card p-4 shadow-[var(--shadow-card)] sm:p-6">
            <label className="relative block">
              <span className="sr-only">Buscar por nome do produto</span>
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-espresso/40" />
              <input
                type="search"
                value={filtros.busca}
                maxLength={120}
                onChange={(event) => alterarFiltro("busca", event.target.value)}
                placeholder="Buscar por nome do produto"
                className="w-full rounded-xl border border-border/70 bg-background py-3 pl-11 pr-4 text-sm text-espresso outline-none focus:border-wine"
              />
            </label>

            <fieldset className="mt-5">
              <legend className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-espresso/55">Categoria</legend>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <button type="button" onClick={() => alterarFiltro("categoria", "todos", "todos")} className={`${chipBase} ${filtros.categoria === "todos" ? chipAtivo : chipInativo}`} aria-pressed={filtros.categoria === "todos"}>Todos</button>
                {CATEGORIAS.map((categoria) => (
                  <button key={categoria.value} type="button" onClick={() => alterarFiltro("categoria", categoria.value, "todos")} className={`${chipBase} ${filtros.categoria === categoria.value ? chipAtivo : chipInativo}`} aria-pressed={filtros.categoria === categoria.value}>
                    {categoria.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-5">
              <legend className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-espresso/55">Necessidades — selecione quantas quiser</legend>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {NECESSIDADES.map((necessidade) => {
                  const ativo = filtros.necessidades.includes(necessidade.value);
                  return (
                    <button key={necessidade.value} type="button" onClick={() => alternarNecessidade(necessidade.value)} className={`${chipBase} ${ativo ? chipAtivo : chipInativo}`} aria-pressed={ativo}>
                      {necessidade.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:max-w-xl">
              <label>
                <span className="mb-2 block text-[0.68rem] font-medium uppercase tracking-[0.16em] text-espresso/55">Loja</span>
                <select value={filtros.loja} onChange={(event) => alterarFiltro("loja", event.target.value, "todas")} className="w-full rounded-xl border border-border/70 bg-background px-4 py-3 text-sm text-espresso outline-none focus:border-wine">
                  <option value="todas">Todas as lojas</option>
                  {LOJAS.map((loja) => <option key={loja.value} value={loja.value}>{loja.label}</option>)}
                </select>
              </label>
              <label>
                <span className="mb-2 block text-[0.68rem] font-medium uppercase tracking-[0.16em] text-espresso/55">Ordenar por</span>
                <select value={filtros.ordem} onChange={(event) => alterarFiltro("ordem", event.target.value, "destaques")} className="w-full rounded-xl border border-border/70 bg-background px-4 py-3 text-sm text-espresso outline-none focus:border-wine">
                  <option value="destaques">Destaques</option>
                  <option value="recentes">Mais recentes</option>
                  <option value="menor-preco">Menor preço</option>
                </select>
              </label>
            </div>
          </section>

          <div className="mt-8 flex items-center justify-between gap-4">
            <p className="text-sm text-espresso/60" aria-live="polite">
              {loading ? "Carregando indicações…" : `${filtrados.length} ${filtrados.length === 1 ? "produto encontrado" : "produtos encontrados"}`}
            </p>
            {(temFiltroAplicado(filtros) || filtros.ordem !== "destaques") && (
              <button type="button" onClick={() => setSearchParams({}, { replace: true })} className="inline-flex items-center gap-1.5 text-xs text-wine hover:text-wine-deep">
                <RotateCcw className="h-3.5 w-3.5" /> Limpar filtros
              </button>
            )}
          </div>

          {!loading && filtrados.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-wine/20 bg-blush/30 px-6 py-16 text-center">
              <p className="font-serif text-2xl text-espresso">{produtos.length ? "Nenhum produto com esses filtros" : "Novas indicações em breve"}</p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-espresso/60">
                {produtos.length ? "Tente remover um filtro ou buscar por outro nome." : "Estou preparando uma seleção de produtos que conheço e uso na clínica."}
              </p>
              {produtos.length > 0 && <button type="button" onClick={() => setSearchParams({})} className="btn-outline-wine mt-6">Ver todos os produtos</button>}
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtrados.map((produto) => (
                <ProductCard key={produto.id} produto={produto} pagina={paginaClique} imagem={imagens[produto.id]} />
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Indicacoes;
