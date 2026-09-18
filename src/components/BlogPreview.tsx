import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_url: string | null;
  category: string | null;
};

const BlogPreview = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    supabase
      .from("posts")
      .select("id, title, slug, excerpt, cover_url, category")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(3)
      .then(({ data }) => setPosts(data ?? []));
  }, []);

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="section-padding bg-background">
      <div className="container mx-auto">
        <div className="reveal text-center">
          <span className="eyebrow">Blog</span>
          <h2 className="mt-3 font-serif text-3xl text-espresso md:text-4xl">
            Conteúdo para entender seu cabelo
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-espresso/70">
            Artigos educativos sobre tricologia e saúde capilar
          </p>
        </div>

        <div className="reveal mt-12 grid gap-6 md:grid-cols-3">
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
                  className="h-44 w-full object-cover"
                  loading="lazy"
                />
              )}
              <div className="flex flex-1 flex-col p-6">
                {post.category && (
                  <span className="text-xs uppercase tracking-[0.2em] text-gold">
                    {post.category}
                  </span>
                )}
                <h3 className="mt-2 font-serif text-lg text-espresso transition-colors group-hover:text-wine">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-espresso/70">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="reveal mt-10 text-center">
          <Link to="/blog" className="btn-wine">
            Ver todos os artigos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
