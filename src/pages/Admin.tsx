import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, LogOut, Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_url: string | null;
  category: string | null;
  published: boolean;
  published_at: string | null;
};

const emptyPost: Omit<Post, "id"> = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_url: "",
  category: "",
  published: false,
  published_at: null,
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyPost);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
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
      .then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  const loadPosts = () => {
    supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setPosts((data as Post[]) ?? []));
  };

  useEffect(() => {
    if (isAdmin) loadPosts();
  }, [isAdmin]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setAuthLoading(false);
    if (error) toast.error("E-mail ou senha incorretos.");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setEditing(null);
    setCreating(false);
  };

  const startCreate = () => {
    setForm(emptyPost);
    setEditing(null);
    setCreating(true);
  };

  const startEdit = (post: Post) => {
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? "",
      content: post.content,
      cover_url: post.cover_url ?? "",
      category: post.category ?? "",
      published: post.published,
      published_at: post.published_at,
    });
    setCreating(false);
    setEditing(post);
  };

  const cancelForm = () => {
    setEditing(null);
    setCreating(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      slug: (form.slug || slugify(form.title)).trim(),
      excerpt: form.excerpt?.trim() || null,
      content: form.content,
      cover_url: form.cover_url?.trim() || null,
      category: form.category?.trim() || null,
      published: form.published,
      published_at: form.published
        ? form.published_at ?? new Date().toISOString()
        : null,
      updated_at: new Date().toISOString(),
    };

    const { error } = editing
      ? await supabase.from("posts").update(payload).eq("id", editing.id)
      : await supabase.from("posts").insert(payload);

    setSaving(false);
    if (error) {
      toast.error(
        error.code === "23505"
          ? "Já existe um artigo com esse endereço (slug). Escolha outro."
          : "Não foi possível salvar. Tente novamente."
      );
      return;
    }
    toast.success(editing ? "Artigo atualizado!" : "Artigo criado!");
    cancelForm();
    loadPosts();
  };

  const handleDelete = async (post: Post) => {
    if (!window.confirm(`Excluir o artigo "${post.title}"? Essa ação não pode ser desfeita.`))
      return;
    const { error } = await supabase.from("posts").delete().eq("id", post.id);
    if (error) {
      toast.error("Não foi possível excluir.");
      return;
    }
    toast.success("Artigo excluído.");
    loadPosts();
  };

  const inputClass =
    "w-full rounded-xl border border-border/70 bg-card px-4 py-3 text-sm text-espresso outline-none focus:border-wine";

  let content: React.ReactNode;

  if (!user) {
    content = (
      <form
        onSubmit={handleSignIn}
        className="soft-card mx-auto mt-10 flex w-full max-w-sm flex-col gap-4"
      >
        <h2 className="text-center font-serif text-2xl text-espresso">Entrar</h2>
        <input
          type="email"
          required
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
        <input
          type="password"
          required
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
        <button type="submit" disabled={authLoading} className="btn-wine w-full">
          {authLoading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    );
  } else if (isAdmin === null) {
    content = (
      <p className="mt-16 text-center text-sm text-espresso/60">Verificando acesso…</p>
    );
  } else if (!isAdmin) {
    content = (
      <div className="soft-card mx-auto mt-10 max-w-md text-center">
        <p className="text-sm text-espresso/80">
          Sua conta ainda não tem permissão para gerenciar o blog. Fale com quem
          administra o site para liberar o acesso.
        </p>
        <button onClick={handleSignOut} className="btn-wine mx-auto mt-6">
          Sair
        </button>
      </div>
    );
  } else if (creating || editing) {
    content = (
      <form onSubmit={handleSave} className="mx-auto mt-10 max-w-2xl space-y-4">
        <h2 className="font-serif text-2xl text-espresso">
          {editing ? "Editar artigo" : "Novo artigo"}
        </h2>
        <input
          required
          placeholder="Título do artigo"
          value={form.title}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              title: e.target.value,
              slug: editing ? f.slug : slugify(e.target.value),
            }))
          }
          className={inputClass}
        />
        <input
          required
          placeholder="Endereço do artigo (slug), ex.: queda-de-cabelo-pos-parto"
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          className={inputClass}
        />
        <input
          placeholder="Categoria (ex.: Queda de cabelo)"
          value={form.category ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          className={inputClass}
        />
        <input
          placeholder="Link da imagem de capa (opcional)"
          value={form.cover_url ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, cover_url: e.target.value }))}
          className={inputClass}
        />
        <textarea
          placeholder="Resumo curto que aparece na lista (opcional)"
          value={form.excerpt ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
          rows={3}
          className={inputClass}
        />
        <textarea
          required
          placeholder="Conteúdo do artigo. Separe os parágrafos com uma linha em branco."
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          rows={14}
          className={inputClass}
        />
        <label className="flex items-center gap-3 text-sm text-espresso/80">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
            className="h-4 w-4 accent-wine"
          />
          Publicar agora (desmarcado salva como rascunho)
        </label>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-wine">
            {saving ? "Salvando…" : "Salvar artigo"}
          </button>
          <button
            type="button"
            onClick={cancelForm}
            className="rounded-full border border-espresso/20 px-6 py-3 text-sm text-espresso transition-colors hover:border-wine hover:text-wine"
          >
            Cancelar
          </button>
        </div>
      </form>
    );
  } else {
    content = (
      <div className="mx-auto mt-10 max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-serif text-2xl text-espresso">Meus artigos</h2>
          <div className="flex gap-3">
            <button onClick={startCreate} className="btn-wine">
              <Plus className="h-4 w-4" /> Novo artigo
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 rounded-full border border-espresso/20 px-5 py-3 text-sm text-espresso transition-colors hover:border-wine hover:text-wine"
            >
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </div>

        {posts.length === 0 ? (
          <p className="mt-10 text-center text-sm text-espresso/60">
            Nenhum artigo ainda. Clique em "Novo artigo" para começar.
          </p>
        ) : (
          <ul className="mt-8 space-y-3">
            {posts.map((post) => (
              <li
                key={post.id}
                className="soft-card flex flex-wrap items-center justify-between gap-3"
              >
                <div>
                  <p className="font-serif text-lg text-espresso">{post.title}</p>
                  <p className="text-xs uppercase tracking-[0.15em] text-espresso/50">
                    {post.published ? "Publicado" : "Rascunho"}
                    {post.category ? ` · ${post.category}` : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(post)}
                    aria-label={`Editar ${post.title}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-espresso/20 text-espresso transition-colors hover:border-wine hover:text-wine"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post)}
                    aria-label={`Excluir ${post.title}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-espresso/20 text-espresso transition-colors hover:border-wine hover:text-wine"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-background">
      <Navbar />
      <section className="section-padding pt-32">
        <div className="container mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-espresso/60 transition-colors hover:text-wine"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar para o início
          </Link>
          <h1 className="mt-8 text-center font-serif text-3xl text-espresso md:text-4xl">
            Painel do blog
          </h1>
          {content}
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Admin;
