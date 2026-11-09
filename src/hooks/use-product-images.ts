import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ProdutoIndicado } from "@/lib/indicacoes";

export function useProductImages(produtos: ProdutoIndicado[]) {
  const [imagens, setImagens] = useState<Record<string, string>>({});

  useEffect(() => {
    let ativo = true;
    const carregar = async () => {
      const entradas = await Promise.all(
        produtos.map(async (produto) => {
          if (!produto.imagem_url) return [produto.id, ""] as const;
          if (/^https?:\/\//.test(produto.imagem_url)) return [produto.id, produto.imagem_url] as const;
          const { data, error } = await supabase.storage.from("produtos").createSignedUrl(produto.imagem_url, 3600);
          return [produto.id, error ? "" : data.signedUrl] as const;
        }),
      );
      if (ativo) setImagens(Object.fromEntries(entradas));
    };
    void carregar();
    return () => {
      ativo = false;
    };
  }, [produtos]);

  return imagens;
}
