import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_url: string | null;
  category: string | null;
  published_at: string | null;
};

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("posts")
      .select("id, title, slug, excerpt, cover_url, category, published_at")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .then(({ data }) => {
        setPosts(data ?? []);
        setLoading(false);
      });
  }, []);

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

          <div className="mt-8 text-center">
            <span className="eyebrow">Blog</span>
            <h1 className="mt-3 font-serif text-3xl text-espresso md:text-5xl">
              Saúde capilar, ciência e cuidado
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-espresso/70">
              Conteúdos educativos sobre tricologia, queda de cabelo e tratamentos
              baseados em evidências.
            </p>
          </div>

          {loading ? (
            <p className="mt-16 text-center text-sm text-espresso/60">Carregando artigos…</p>
          ) : posts.length === 0 ? (
            <p className="mt-16 text-center text-sm text-espresso/60">
              Em breve, novos artigos por aqui.
            </p>
          ) : (
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="soft-card group flex h-full flex-col overflow-hidden !p-0"
                >
                  {post.cover_url && (
                    <img
                      src={post.cover_url}
                      alt={post.title}
                      className="h-48 w-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    {post.category && (
                      <span className="text-xs uppercase tracking-[0.2em] text-gold">
                        {post.category}
                      </span>
                    )}
                    <h2 className="mt-2 font-serif text-xl text-espresso transition-colors group-hover:text-wine">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-espresso/70">
                        {post.excerpt}
                      </p>
                    )}
                    <span className="mt-4 inline-flex items-center gap-2 text-sm text-wine">
                      Ler artigo <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Blog;
