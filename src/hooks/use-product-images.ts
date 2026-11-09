import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ProdutoIndicado } from "@/lib/indicacoes";

export function useProductImages(produtos: ProdutoIndicado[]) {
  const [imagens, setImagens] = useState<Record<string, string>>({});

  useEffect(() => {
    let ativo = true;
    const carregar = async () => {
      const resultado: Record<string, string> = {};
      const privados: ProdutoIndicado[] = [];
      for (const produto of produtos) {
        if (!produto.imagem_url) continue;
        if (/^https?:\/\//.test(produto.imagem_url)) resultado[produto.id] = produto.imagem_url;
        else privados.push(produto);
      }

      if (privados.length) {
        // Visitantes: links temporários gerados no servidor só para produtos ativos.
        const { data } = await supabase.functions.invoke("imagens-produtos", {
          body: { ids: privados.map((p) => p.id) },
        });
        Object.assign(resultado, (data?.imagens as Record<string, string> | undefined) ?? {});

        // Administradoras: imagens de produtos inativos, liberadas pela regra de acesso.
        await Promise.all(
          privados
            .filter((p) => !resultado[p.id])
            .map(async (p) => {
              const { data: assinado } = await supabase.storage.from("produtos").createSignedUrl(p.imagem_url!, 3600);
              if (assinado?.signedUrl) resultado[p.id] = assinado.signedUrl;
            }),
        );
      }

      if (ativo) setImagens(resultado);
    };
    void carregar();
    return () => {
      ativo = false;
    };
  }, [produtos]);

  return imagens;
}
