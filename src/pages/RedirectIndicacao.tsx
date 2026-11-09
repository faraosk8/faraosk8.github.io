import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { origemSemDadosPessoais, type PaginaClique } from "@/lib/indicacoes";

const paginaSchema = z.enum(["home", "indicacoes", "filtro_aplicado"]);

const RedirectIndicacao = () => {
  const { slug = "" } = useParams();
  const [searchParams] = useSearchParams();
  const paginaParam = searchParams.get("pagina") ?? "indicacoes";
  const [erro, setErro] = useState("");
  const [destino, setDestino] = useState("");
  const executado = useRef(false);

  useEffect(() => {
    if (executado.current) return;
    executado.current = true;

    const abrirLoja = async () => {
      const slugValido = z.string().min(2).max(100).regex(/^[a-z0-9-]+$/).safeParse(slug);
      const paginaValida = paginaSchema.safeParse(paginaParam);
      if (!slugValido.success) {
        setErro("Este link de indicação não é válido.");
        return;
      }
      const pagina: PaginaClique = paginaValida.success ? paginaValida.data : "indicacoes";
      const { data: produto, error } = await supabase
        .from("produtos_indicados")
        .select("id, link_afiliado")
        .eq("slug", slugValido.data)
        .eq("ativo", true)
        .maybeSingle();

      if (error || !produto) {
        setErro("Esta indicação não está mais disponível.");
        return;
      }

      let url: URL;
      try {
        url = new URL(produto.link_afiliado);
        if (!["http:", "https:"].includes(url.protocol)) throw new Error("invalid protocol");
      } catch {
        setErro("O endereço da loja não está disponível.");
        return;
      }

      setDestino(url.toString());
      await supabase.from("cliques_indicacoes").insert({
        produto_id: produto.id,
        origem: origemSemDadosPessoais(document.referrer),
        pagina,
      });
      window.location.replace(url.toString());
    };

    void abrirLoja();
  }, [slug, paginaParam]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <div className="soft-card w-full max-w-md text-center">
        {erro ? (
          <>
            <h1 className="font-serif text-3xl text-espresso">Indicação indisponível</h1>
            <p className="mt-3 text-sm leading-relaxed text-espresso/65">{erro}</p>
            <Link to="/indicacoes" className="btn-wine mt-6"><ArrowLeft className="h-4 w-4" /> Ver indicações</Link>
          </>
        ) : (
          <>
            <h1 className="font-serif text-3xl text-espresso">Abrindo a loja…</h1>
            <p className="mt-3 text-sm leading-relaxed text-espresso/65">Você será direcionado para concluir sua visita na loja parceira.</p>
            {destino && (
              <a href={destino} target="_blank" rel="sponsored nofollow noopener noreferrer" className="btn-outline-wine mt-6">
                Continuar para a loja <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default RedirectIndicacao;
