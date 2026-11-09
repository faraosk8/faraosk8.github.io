CREATE TABLE public.produtos_indicados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  nome TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  imagem_url TEXT,
  loja TEXT NOT NULL CHECK (loja IN ('amazon', 'mercado_livre', 'shopee', 'magalu', 'outra')),
  loja_outra_nome TEXT,
  link_afiliado TEXT NOT NULL,
  categoria TEXT NOT NULL CHECK (categoria IN ('cabelo-couro-cabeludo', 'skincare', 'protecao-solar', 'corpo', 'acessorios-ferramentas')),
  necessidades TEXT[] NOT NULL DEFAULT '{}',
  por_que_indico TEXT NOT NULL DEFAULT '' CHECK (char_length(por_que_indico) <= 160),
  preco NUMERIC(10, 2) CHECK (preco IS NULL OR preco >= 0),
  preco_anterior NUMERIC(10, 2) CHECK (preco_anterior IS NULL OR preco_anterior >= 0),
  preco_verificado_em DATE,
  cupom TEXT,
  cupom_validade DATE,
  favorito BOOLEAN NOT NULL DEFAULT false,
  destaque_home BOOLEAN NOT NULL DEFAULT false,
  ordem INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true
);
GRANT SELECT ON public.produtos_indicados TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.produtos_indicados TO authenticated;
GRANT ALL ON public.produtos_indicados TO service_role;
ALTER TABLE public.produtos_indicados ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Produtos ativos são públicos" ON public.produtos_indicados
  FOR SELECT TO anon, authenticated
  USING (ativo = true);
CREATE POLICY "Administradores veem todos os produtos" ON public.produtos_indicados
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Administradores criam produtos" ON public.produtos_indicados
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Administradores editam produtos" ON public.produtos_indicados
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Administradores excluem produtos" ON public.produtos_indicados
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.cliques_indicacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id UUID NOT NULL REFERENCES public.produtos_indicados(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  origem TEXT,
  pagina TEXT NOT NULL CHECK (pagina IN ('home', 'indicacoes', 'filtro_aplicado'))
);
GRANT INSERT ON public.cliques_indicacoes TO anon;
GRANT SELECT, INSERT ON public.cliques_indicacoes TO authenticated;
GRANT ALL ON public.cliques_indicacoes TO service_role;
ALTER TABLE public.cliques_indicacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cliques podem ser registrados sem identificação" ON public.cliques_indicacoes
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    (origem IS NULL OR char_length(origem) <= 200)
    AND EXISTS (
      SELECT 1 FROM public.produtos_indicados
      WHERE id = produto_id AND ativo = true
    )
  );
CREATE POLICY "Administradores leem cliques" ON public.cliques_indicacoes
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX cliques_indicacoes_created_at_idx ON public.cliques_indicacoes(created_at DESC);
CREATE INDEX cliques_indicacoes_produto_created_at_idx ON public.cliques_indicacoes(produto_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.atualizar_produto_indicado()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER produtos_indicados_updated_at
BEFORE UPDATE ON public.produtos_indicados
FOR EACH ROW EXECUTE FUNCTION public.atualizar_produto_indicado();

CREATE POLICY "Imagens de produtos podem ser lidas" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'produtos');
CREATE POLICY "Administradores enviam imagens de produtos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'produtos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Administradores atualizam imagens de produtos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'produtos' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'produtos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Administradores excluem imagens de produtos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'produtos' AND public.has_role(auth.uid(), 'admin'));