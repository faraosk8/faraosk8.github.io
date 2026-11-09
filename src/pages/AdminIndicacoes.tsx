import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { ArrowLeft, BarChart3, Copy, GripVertical, LogOut, Package, Pencil, Plus, Power, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProdutoForm from "@/components/admin/ProdutoForm";
import RelatorioIndicacoes from "@/components/admin/RelatorioIndicacoes";
import { supabase } from "@/integrations/supabase/client";
import { useProductImages } from "@/hooks/use-product-images";
import { cupomDisponivel, nomeLoja, precoDesatualizado, rotuloCategoria, type ProdutoIndicado } from "@/lib/indicacoes";

const AdminIndicacoes = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [produtos, setProdutos] = useState<ProdutoIndicado[]>([]);
  const [cliques30, setCliques30] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<ProdutoIndicado | null>(null);
  const [creating, setCreating] = useState(false);
  const [aba, setAba] = useState<"produtos" | "relatorio">("produtos");
  const imagens = useProductImages(produtos);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthChecked(true);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthChecked(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setIsAdmin(null);
      return;
    }
    supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle().then(({ data }) => setIsAdmin(Boolean(data)));
  }, [user]);

  const carregarCliques = async (lista: ProdutoIndicado[]) => {
    const inicio = new Date();
    inicio.setDate(inicio.getDate() - 30);
    const resultados = await Promise.all(lista.map(async (produto) => {
      const { count } = await supabase.from("cliques_indicacoes").select("id", { count: "exact", head: true }).eq("produto_id", produto.id).gte("created_at", inicio.toISOString());
      return [produto.id, count ?? 0] as const;
    }));
    setCliques30(Object.fromEntries(resultados));
  };

  const carregarProdutos = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("produtos_indicados").select("*").order("ordem", { ascending: true }).order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      toast.error("Não foi possível carregar os produtos.");
      return;
    }
    const lista = data ?? [];
    setProdutos(lista);
    void carregarCliques(lista);
  };

  useEffect(() => {
    if (isAdmin) void carregarProdutos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const entrar = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setAuthLoading(false);
    if (error) {
      setAuthError(error.message.toLowerCase().includes("email not confirmed") ? "Confirme seu e-mail antes de entrar. Verifique também a pasta de spam." : "E-mail ou senha incorretos.");
    }
  };

  const sair = async () => {
    await supabase.auth.signOut();
    setProdutos([]);
    setEditing(null);
    setCreating(false);
  };

  const atualizacaoRapida = async (produto: ProdutoIndicado, campo: "ativo" | "destaque_home") => {
    const { error } = campo === "ativo"
      ? await supabase.from("produtos_indicados").update({ ativo: !produto.ativo }).eq("id", produto.id)
      : await supabase.from("produtos_indicados").update({ destaque_home: !produto.destaque_home }).eq("id", produto.id);
    if (error) {
      toast.error("Não foi possível atualizar o produto.");
      return;
    }
    setProdutos((atual) => atual.map((item) => item.id === produto.id ? { ...item, [campo]: !item[campo] } : item));
  };

  const duplicar = async (produto: ProdutoIndicado) => {
    const { id: _id, created_at: _createdAt, updated_at: _updatedAt, ...dados } = produto;
    const { error } = await supabase.from("produtos_indicados").insert({
      ...dados,
      nome: `${produto.nome} (cópia)`.slice(0, 160),
      slug: `${produto.slug.slice(0, 82)}-copia-${Date.now().toString().slice(-8)}`,
      ativo: false,
      destaque_home: false,
      ordem: produtos.length,
    });
    if (error) {
      toast.error("Não foi possível duplicar o produto.");
      return;
    }
    toast.success("Cópia criada como produto inativo.");
    void carregarProdutos();
  };

  const excluir = async (produto: ProdutoIndicado) => {
    if (!window.confirm(`Excluir “${produto.nome}”? Os cliques relacionados também serão excluídos.`)) return;
    const { error } = await supabase.from("produtos_indicados").delete().eq("id", produto.id);
    if (error) {
      toast.error("Não foi possível excluir o produto.");
      return;
    }
    if (produto.imagem_url && !/^https?:\/\//.test(produto.imagem_url)) await supabase.storage.from("produtos").remove([produto.imagem_url]);
    toast.success("Produto excluído.");
    void carregarProdutos();
  };

  const soltarProduto = async (event: React.DragEvent, destinoId: string) => {
    event.preventDefault();
    const origemId = event.dataTransfer.getData("text/produto-id");
    if (!origemId || origemId === destinoId) return;
    const novaLista = [...produtos];
    const origem = novaLista.findIndex((item) => item.id === origemId);
    const destino = novaLista.findIndex((item) => item.id === destinoId);
    if (origem < 0 || destino < 0) return;
    const [movido] = novaLista.splice(origem, 1);
    novaLista.splice(destino, 0, movido);
    setProdutos(novaLista);
    const resultados = await Promise.all(novaLista.map((produto, index) => supabase.from("produtos_indicados").update({ ordem: index }).eq("id", produto.id)));
    if (resultados.some((resultado) => resultado.error)) {
      toast.error("A ordem não foi salva por completo. Recarregando a lista.");
      void carregarProdutos();
      return;
    }
    toast.success("Ordem atualizada.");
  };

  const concluirFormulario = () => {
    setEditing(null);
    setCreating(false);
    void carregarProdutos();
  };

  let content: React.ReactNode;
  if (!authChecked) {
    content = <p className="mt-16 text-center text-sm text-espresso/60">Verificando acesso…</p>;
  } else if (!user) {
    content = (
      <form onSubmit={(event) => void entrar(event)} className="soft-card mx-auto mt-10 flex w-full max-w-sm flex-col gap-4">
        <h2 className="text-center font-serif text-2xl text-espresso">Entrar</h2>
        <input type="email" required autoComplete="email" placeholder="Seu e-mail" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-border/70 bg-card px-4 py-3 text-sm text-espresso outline-none focus:border-wine" />
        <input type="password" required autoComplete="current-password" placeholder="Sua senha" value={password} onChange={(event) => { setPassword(event.target.value); setAuthError(""); }} className="w-full rounded-xl border border-border/70 bg-card px-4 py-3 text-sm text-espresso outline-none focus:border-wine" />
        {authError && <p role="alert" className="text-sm text-destructive">{authError}</p>}
        <button type="submit" disabled={authLoading} className="btn-wine w-full">{authLoading ? "Aguarde…" : "Entrar"}</button>
      </form>
    );
  } else if (isAdmin === null) {
    content = <p className="mt-16 text-center text-sm text-espresso/60">Verificando permissão…</p>;
  } else if (!isAdmin) {
    content = (
      <div className="soft-card mx-auto mt-10 max-w-md text-center">
        <p className="text-sm text-espresso/80">Sua conta não tem permissão para gerenciar as indicações.</p>
        <button onClick={() => void sair()} className="btn-wine mx-auto mt-6"><LogOut className="h-4 w-4" /> Sair</button>
      </div>
    );
  } else if (creating || editing) {
    content = <ProdutoForm produto={editing} ordemSugerida={produtos.length} onCancel={() => { setCreating(false); setEditing(null); }} onSaved={concluirFormulario} />;
  } else {
    content = (
      <div className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex rounded-full border border-wine/15 bg-card p-1">
            <button type="button" onClick={() => setAba("produtos")} className={`rounded-full px-4 py-2 text-sm ${aba === "produtos" ? "bg-wine text-primary-foreground" : "text-espresso/60"}`}><Package className="mr-1.5 inline h-4 w-4" /> Produtos</button>
            <button type="button" onClick={() => setAba("relatorio")} className={`rounded-full px-4 py-2 text-sm ${aba === "relatorio" ? "bg-wine text-primary-foreground" : "text-espresso/60"}`}><BarChart3 className="mr-1.5 inline h-4 w-4" /> Relatório</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {aba === "produtos" && <button type="button" onClick={() => setCreating(true)} className="btn-wine !py-2.5"><Plus className="h-4 w-4" /> Novo produto</button>}
            <button type="button" onClick={() => void sair()} className="btn-outline-wine !py-2.5"><LogOut className="h-4 w-4" /> Sair</button>
          </div>
        </div>

        {aba === "relatorio" ? <RelatorioIndicacoes produtos={produtos} /> : (
          <>
            <p className="mt-6 text-xs leading-relaxed text-espresso/50">Arraste os produtos para reordenar. O número de cliques considera os últimos 30 dias.</p>
            {loading ? <p className="mt-12 text-center text-sm text-espresso/60">Carregando produtos…</p> : produtos.length === 0 ? (
              <div className="mt-8 rounded-3xl border border-dashed border-wine/20 bg-blush/30 px-6 py-16 text-center">
                <p className="font-serif text-2xl text-espresso">Nenhum produto cadastrado</p>
                <p className="mt-2 text-sm text-espresso/60">Clique em “Novo produto” para criar a primeira indicação.</p>
              </div>
            ) : (
              <ul className="mt-5 space-y-3">
                {produtos.map((produto) => {
                  const cupomVencido = Boolean(produto.cupom && produto.cupom_validade && !cupomDisponivel(produto));
                  const precoAntigo = precoDesatualizado(produto);
                  return (
                    <li key={produto.id} draggable onDragStart={(event) => { event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("text/produto-id", produto.id); }} onDragOver={(event) => event.preventDefault()} onDrop={(event) => void soltarProduto(event, produto.id)} className="rounded-2xl border border-border/70 bg-card p-4 shadow-[var(--shadow-card)]">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <GripVertical className="h-5 w-5 shrink-0 cursor-grab text-espresso/30" aria-label="Arraste para reordenar" />
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-sand text-wine/30">
                            {imagens[produto.id] ? <img src={imagens[produto.id]} alt="" className="h-full w-full object-cover" /> : <Package className="h-6 w-6" />}
                          </div>
                          <div className="min-w-0">
                            <h2 className="truncate font-serif text-xl text-espresso" title={produto.nome}>{produto.nome}</h2>
                            <p className="mt-1 text-xs text-espresso/55">{nomeLoja(produto)} · {rotuloCategoria(produto.categoria)}</p>
                            <div className="mt-1.5 flex flex-wrap gap-2 text-[0.65rem]">
                              <span className={`rounded-full px-2 py-1 ${produto.ativo ? "bg-blush text-wine" : "bg-muted text-muted-foreground"}`}>{produto.ativo ? "Ativo" : "Inativo"}</span>
                              {produto.destaque_home && <span className="rounded-full bg-sand px-2 py-1 text-espresso/65">Destaque na home</span>}
                              <span className="rounded-full bg-sand px-2 py-1 text-espresso/65">{cliques30[produto.id] ?? 0} cliques/30 dias</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pl-8 lg:justify-end lg:pl-0">
                          <button type="button" title={produto.ativo ? "Desativar" : "Ativar"} aria-label={`${produto.ativo ? "Desativar" : "Ativar"} ${produto.nome}`} onClick={() => void atualizacaoRapida(produto, "ativo")} className="rounded-full border border-espresso/15 p-2.5 text-espresso/60 hover:border-wine hover:text-wine"><Power className="h-4 w-4" /></button>
                          <button type="button" title={produto.destaque_home ? "Remover destaque" : "Destacar na home"} aria-label={`${produto.destaque_home ? "Remover destaque de" : "Destacar"} ${produto.nome}`} onClick={() => void atualizacaoRapida(produto, "destaque_home")} className={`rounded-full border p-2.5 ${produto.destaque_home ? "border-gold/50 bg-sand text-gold" : "border-espresso/15 text-espresso/60 hover:border-wine hover:text-wine"}`}><Star className="h-4 w-4" fill={produto.destaque_home ? "currentColor" : "none"} /></button>
                          <button type="button" title="Editar" aria-label={`Editar ${produto.nome}`} onClick={() => setEditing(produto)} className="rounded-full border border-espresso/15 p-2.5 text-espresso/60 hover:border-wine hover:text-wine"><Pencil className="h-4 w-4" /></button>
                          <button type="button" title="Duplicar" aria-label={`Duplicar ${produto.nome}`} onClick={() => void duplicar(produto)} className="rounded-full border border-espresso/15 p-2.5 text-espresso/60 hover:border-wine hover:text-wine"><Copy className="h-4 w-4" /></button>
                          <button type="button" title="Excluir" aria-label={`Excluir ${produto.nome}`} onClick={() => void excluir(produto)} className="rounded-full border border-espresso/15 p-2.5 text-espresso/60 hover:border-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                      {(precoAntigo || cupomVencido) && (
                        <div className="mt-3 flex flex-wrap gap-2 border-t border-border/60 pt-3 text-xs text-terracotta">
                          {precoAntigo && <span>Preço verificado há mais de 15 dias.</span>}
                          {cupomVencido && <span>Cupom vencido; ele já está oculto no site.</span>}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-background">
      <Navbar />
      <section className="section-padding pt-28 md:pt-32">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-espresso/60 transition-colors hover:text-wine"><ArrowLeft className="h-4 w-4" /> Voltar para o início</Link>
            {isAdmin && <div className="flex gap-4 text-xs text-espresso/55"><Link to="/admin" className="hover:text-wine">Painel do blog</Link><Link to="/admin/inscricoes" className="hover:text-wine">Inscrições</Link></div>}
          </div>
          <h1 className="mt-8 text-center font-serif text-3xl text-espresso md:text-4xl">Gerenciar indicações</h1>
          {content}
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default AdminIndicacoes;
