import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { ArrowLeft, Download, LogOut, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Inscricao = Tables<"inscricoes_olhar_cuidado">;

const statusOptions = ["nova", "em contato", "agendada", "atendida", "não selecionada"] as const;

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));

const csvCell = (value: string | number | boolean | null) => {
  const text = value === null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
};

const AdminInscricoes = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("todos");
  const [bairroFilter, setBairroFilter] = useState("todos");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Inscricao | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Inscricao["status"]>("nova");
  const [saving, setSaving] = useState(false);

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
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => setIsAdmin(Boolean(data)));
  }, [user]);

  const loadInscricoes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("inscricoes_olhar_cuidado")
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      toast.error("Não foi possível carregar as inscrições.");
      return;
    }
    setInscricoes(data ?? []);
  };

  useEffect(() => {
    if (isAdmin) void loadInscricoes();
  }, [isAdmin]);

  const bairros = useMemo(
    () => Array.from(new Set(inscricoes.map((item) => item.bairro))).sort((a, b) => a.localeCompare(b, "pt-BR")),
    [inscricoes],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    return inscricoes.filter((item) =>
      (statusFilter === "todos" || item.status === statusFilter) &&
      (bairroFilter === "todos" || item.bairro === bairroFilter) &&
      (!term || item.nome.toLocaleLowerCase("pt-BR").includes(term)),
    );
  }, [inscricoes, statusFilter, bairroFilter, search]);

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setAuthLoading(false);
    if (error) {
      const message = error.message.toLowerCase().includes("email not confirmed")
        ? "Confirme seu e-mail antes de entrar. Verifique também a pasta de spam."
        : "E-mail ou senha incorretos.";
      setAuthError(message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSelected(null);
    setInscricoes([]);
  };

  const openDetails = (item: Inscricao) => {
    setSelected(item);
    setSelectedStatus(item.status);
  };

  const saveStatus = async () => {
    if (!selected) return;
    setSaving(true);
    const { error } = await supabase
      .from("inscricoes_olhar_cuidado")
      .update({ status: selectedStatus })
      .eq("id", selected.id);
    setSaving(false);
    if (error) {
      toast.error("Não foi possível atualizar o status.");
      return;
    }
    toast.success("Status atualizado.");
    setSelected(null);
    void loadInscricoes();
  };

  const deleteInscricao = async () => {
    if (!selected || !window.confirm(`Excluir a inscrição de ${selected.nome}? Essa ação não pode ser desfeita.`)) return;
    setSaving(true);
    const { error } = await supabase.from("inscricoes_olhar_cuidado").delete().eq("id", selected.id);
    setSaving(false);
    if (error) {
      toast.error("Não foi possível excluir a inscrição.");
      return;
    }
    toast.success("Inscrição excluída.");
    setSelected(null);
    void loadInscricoes();
  };

  const exportCsv = () => {
    const headers = ["Data", "Nome", "Idade", "Telefone", "E-mail", "Bairro", "Cidade", "Motivo", "Responsável", "Telefone do responsável", "Autorização do responsável", "Consentimento LGPD", "Status"];
    const rows = filtered.map((item) => [
      item.created_at,
      item.nome,
      item.idade,
      item.telefone,
      item.email,
      item.bairro,
      item.cidade,
      item.motivo,
      item.nome_responsavel,
      item.telefone_responsavel,
      item.autorizacao_responsavel,
      item.consentimento_lgpd,
      item.status,
    ]);
    const csv = `\uFEFF${[headers, ...rows].map((row) => row.map(csvCell).join(";")).join("\r\n")}`;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `inscricoes-um-olhar-de-cuidado-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  let content: React.ReactNode;
  if (!authChecked) {
    content = <p className="mt-16 text-center text-sm text-espresso/60">Verificando acesso…</p>;
  } else if (!user) {
    content = (
      <form onSubmit={handleSignIn} className="soft-card mx-auto mt-10 flex w-full max-w-sm flex-col gap-4">
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
        <p className="text-sm text-espresso/80">Sua conta não tem permissão para visualizar as inscrições. Fale com quem administra o site.</p>
        <button onClick={handleSignOut} className="btn-wine mx-auto mt-6"><LogOut className="h-4 w-4" /> Sair</button>
      </div>
    );
  } else {
    content = (
      <div className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-espresso/60">{filtered.length} de {inscricoes.length} inscrições</p>
          <div className="flex gap-3">
            <button onClick={exportCsv} disabled={filtered.length === 0} className="btn-outline-wine disabled:cursor-not-allowed disabled:opacity-50">
              <Download className="h-4 w-4" /> Exportar CSV
            </button>
            <button onClick={handleSignOut} className="btn-outline-wine"><LogOut className="h-4 w-4" /> Sair</button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-[1fr_180px_180px]">
          <label className="relative">
            <span className="sr-only">Buscar por nome</span>
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-espresso/40" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nome" className="w-full rounded-xl border border-border/70 bg-card py-3 pl-11 pr-4 text-sm text-espresso outline-none focus:border-wine" />
          </label>
          <label>
            <span className="sr-only">Filtrar por status</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full rounded-xl border border-border/70 bg-card px-4 py-3 text-sm text-espresso outline-none focus:border-wine">
              <option value="todos">Todos os status</option>
              {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </label>
          <label>
            <span className="sr-only">Filtrar por bairro</span>
            <select value={bairroFilter} onChange={(event) => setBairroFilter(event.target.value)} className="w-full rounded-xl border border-border/70 bg-card px-4 py-3 text-sm text-espresso outline-none focus:border-wine">
              <option value="todos">Todos os bairros</option>
              {bairros.map((bairro) => <option key={bairro} value={bairro}>{bairro}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-border/70 bg-card">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-border/70 bg-secondary/50 text-xs uppercase tracking-[0.1em] text-espresso/60">
              <tr>
                <th className="px-5 py-4 font-medium">Nome</th>
                <th className="px-5 py-4 font-medium">Telefone</th>
                <th className="px-5 py-4 font-medium">Bairro</th>
                <th className="px-5 py-4 font-medium">Data</th>
                <th className="px-5 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => openDetails(item)}
                  onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") openDetails(item); }}
                  tabIndex={0}
                  className="cursor-pointer text-espresso/80 transition-colors hover:bg-secondary/40 focus:bg-secondary/40 focus:outline-none"
                >
                  <td className="px-5 py-4">
                    <span className="font-medium text-espresso">{item.nome}</span>
                    {item.idade < 18 && <span className="ml-2 rounded-full bg-project-beige px-2 py-1 text-[0.65rem] font-medium text-terracotta">Menor de 18</span>}
                  </td>
                  <td className="px-5 py-4">{item.telefone}</td>
                  <td className="px-5 py-4">{item.bairro}</td>
                  <td className="px-5 py-4">{formatDate(item.created_at)}</td>
                  <td className="px-5 py-4"><span className="rounded-full bg-secondary px-3 py-1 text-xs capitalize">{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && <p className="p-10 text-center text-sm text-espresso/60">Nenhuma inscrição encontrada.</p>}
          {loading && <p className="p-10 text-center text-sm text-espresso/60">Carregando inscrições…</p>}
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-background">
      <Navbar />
      <section className="section-padding pt-32">
        <div className="container mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-espresso/60 transition-colors hover:text-wine"><ArrowLeft className="h-4 w-4" /> Voltar para o início</Link>
          <h1 className="mt-8 text-center font-serif text-3xl text-espresso md:text-4xl">Inscrições — Um Olhar de Cuidado</h1>
          {content}
        </div>
      </section>
      <Footer />

      {selected && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-cocoa/45 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="detalhe-inscricao" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-project-cream p-6 shadow-[var(--shadow-soft)] md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-terracotta">Detalhes da inscrição</p>
                <h2 id="detalhe-inscricao" className="mt-2 font-serif text-3xl text-cocoa">{selected.nome}</h2>
                {selected.idade < 18 && <p className="mt-2 text-sm font-medium text-terracotta">Menor de idade – com autorização do responsável</p>}
              </div>
              <button onClick={() => setSelected(null)} aria-label="Fechar detalhes" className="rounded-full border border-cocoa/15 p-2 text-cocoa transition-colors hover:bg-project-beige"><X className="h-5 w-5" /></button>
            </div>

            <dl className="mt-7 grid gap-4 text-sm sm:grid-cols-2">
              {[
                ["Idade", selected.idade],
                ["Telefone", selected.telefone],
                ["E-mail", selected.email || "Não informado"],
                ["Bairro", selected.bairro],
                ["Cidade", selected.cidade],
                ["Data da inscrição", formatDate(selected.created_at)],
              ].map(([label, value]) => <div key={label}><dt className="text-xs uppercase tracking-[0.12em] text-cocoa/50">{label}</dt><dd className="mt-1 text-cocoa">{value}</dd></div>)}
            </dl>

            <div className="mt-6">
              <h3 className="text-xs uppercase tracking-[0.12em] text-cocoa/50">Por que gostaria de participar?</h3>
              <p className="mt-2 whitespace-pre-wrap rounded-2xl bg-project-beige/45 p-4 text-sm leading-relaxed text-cocoa/85">{selected.motivo}</p>
            </div>

            {selected.idade < 18 && (
              <div className="mt-6 rounded-2xl border border-terracotta/15 p-4 text-sm text-cocoa/80">
                <p><strong>Responsável:</strong> {selected.nome_responsavel}</p>
                <p className="mt-2"><strong>Telefone:</strong> {selected.telefone_responsavel}</p>
                <p className="mt-2"><strong>Autorização:</strong> {selected.autorizacao_responsavel ? "Confirmada" : "Não confirmada"}</p>
              </div>
            )}

            <div className="mt-7 flex flex-col gap-3 border-t border-cocoa/10 pt-6 sm:flex-row sm:items-end">
              <label className="flex-1 text-sm text-cocoa">
                <span className="mb-2 block font-medium">Status da inscrição</span>
                <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value as Inscricao["status"])} className="project-input">
                  {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </label>
              <button onClick={saveStatus} disabled={saving} className="btn-terracotta">{saving ? "Salvando…" : "Salvar status"}</button>
            </div>
            <button onClick={deleteInscricao} disabled={saving} className="mt-5 inline-flex items-center gap-2 text-sm text-destructive hover:underline"><Trash2 className="h-4 w-4" /> Excluir inscrição</button>
          </section>
        </div>
      )}
    </main>
  );
};

export default AdminInscricoes;
