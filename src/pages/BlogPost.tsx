import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Post = {
  title: string;
  content: string;
  cover_url: string | null;
  category: string | null;
  published_at: string | null;
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("posts")
      .select("title, content, cover_url, category, published_at")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle()
      .then(({ data }) => {
        setPost(data);
        setLoading(false);
      });
  }, [slug]);

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-background">
      <Navbar />
      <article className="section-padding pt-32">
        <div className="container mx-auto max-w-3xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-espresso/60 transition-colors hover:text-wine"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar para o blog
          </Link>

          {loading ? (
            <p className="mt-16 text-center text-sm text-espresso/60">Carregando…</p>
          ) : !post ? (
            <p className="mt-16 text-center text-sm text-espresso/60">
              Artigo não encontrado.
            </p>
          ) : (
            <>
              {post.category && (
                <span className="eyebrow mt-8 inline-block">{post.category}</span>
              )}
              <h1 className="mt-3 font-serif text-3xl text-espresso md:text-5xl">
                {post.title}
              </h1>
              {post.published_at && (
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-espresso/50">
                  {new Date(post.published_at).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
              {post.cover_url && (
                <img
                  src={post.cover_url}
                  alt={post.title}
                  className="mt-8 w-full rounded-3xl object-cover"
                />
              )}
              <div className="mt-8 space-y-5">
                {post.content.split(/\n{2,}/).map((paragrafo, i) => (
                  <p key={i} className="text-base leading-relaxed text-espresso/80">
                    {paragrafo}
                  </p>
                ))}
              </div>
            </>
          )}
        </div>
      </article>
      <Footer />
    </main>
  );
};

export default BlogPost;
