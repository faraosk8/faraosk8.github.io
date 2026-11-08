CREATE TABLE public.inscricoes_olhar_cuidado (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  nome text NOT NULL CHECK (char_length(nome) BETWEEN 3 AND 120),
  idade integer NOT NULL CHECK (idade BETWEEN 1 AND 120),
  telefone text NOT NULL CHECK (char_length(telefone) BETWEEN 10 AND 20),
  email text CHECK (email IS NULL OR char_length(email) <= 255),
  bairro text NOT NULL CHECK (char_length(bairro) BETWEEN 2 AND 100),
  cidade text NOT NULL CHECK (char_length(cidade) BETWEEN 2 AND 100),
  motivo text NOT NULL CHECK (char_length(motivo) BETWEEN 1 AND 600),
  nome_responsavel text CHECK (nome_responsavel IS NULL OR char_length(nome_responsavel) <= 120),
  telefone_responsavel text CHECK (telefone_responsavel IS NULL OR char_length(telefone_responsavel) <= 20),
  autorizacao_responsavel boolean NOT NULL DEFAULT false,
  consentimento_lgpd boolean NOT NULL,
  status text NOT NULL DEFAULT 'nova' CHECK (status IN ('nova', 'em contato', 'agendada', 'atendida', 'não selecionada')),
  CHECK (consentimento_lgpd = true),
  CHECK (
    idade >= 18 OR (
      nome_responsavel IS NOT NULL AND char_length(nome_responsavel) >= 3
      AND telefone_responsavel IS NOT NULL AND char_length(telefone_responsavel) >= 10
      AND autorizacao_responsavel = true
    )
  )
);

GRANT INSERT ON public.inscricoes_olhar_cuidado TO anon;
GRANT INSERT, SELECT, UPDATE, DELETE ON public.inscricoes_olhar_cuidado TO authenticated;
GRANT ALL ON public.inscricoes_olhar_cuidado TO service_role;

ALTER TABLE public.inscricoes_olhar_cuidado ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Publico pode enviar inscricoes"
ON public.inscricoes_olhar_cuidado
FOR INSERT
TO anon, authenticated
WITH CHECK (
  consentimento_lgpd = true
  AND (idade >= 18 OR autorizacao_responsavel = true)
);

CREATE POLICY "Administradores podem ler inscricoes"
ON public.inscricoes_olhar_cuidado
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Administradores podem editar inscricoes"
ON public.inscricoes_olhar_cuidado
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Administradores podem excluir inscricoes"
ON public.inscricoes_olhar_cuidado
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX inscricoes_olhar_cuidado_created_at_idx ON public.inscricoes_olhar_cuidado (created_at DESC);
CREATE INDEX inscricoes_olhar_cuidado_status_idx ON public.inscricoes_olhar_cuidado (status);
CREATE INDEX inscricoes_olhar_cuidado_bairro_idx ON public.inscricoes_olhar_cuidado (bairro);

CREATE TABLE public.inscricoes_olhar_cuidado_rate_limits (
  chave_hash text NOT NULL,
  janela_inicio timestamptz NOT NULL,
  quantidade integer NOT NULL DEFAULT 1 CHECK (quantidade > 0),
  PRIMARY KEY (chave_hash, janela_inicio)
);

GRANT ALL ON public.inscricoes_olhar_cuidado_rate_limits TO service_role;

ALTER TABLE public.inscricoes_olhar_cuidado_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.consumir_limite_olhar_cuidado(p_chave_hash text, p_limite integer DEFAULT 3)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_janela timestamptz := date_trunc('hour', now());
  v_quantidade integer;
BEGIN
  IF p_chave_hash IS NULL OR char_length(p_chave_hash) < 32 THEN
    RETURN false;
  END IF;

  INSERT INTO public.inscricoes_olhar_cuidado_rate_limits (chave_hash, janela_inicio, quantidade)
  VALUES (p_chave_hash, v_janela, 1)
  ON CONFLICT (chave_hash, janela_inicio)
  DO UPDATE SET quantidade = public.inscricoes_olhar_cuidado_rate_limits.quantidade + 1
  RETURNING quantidade INTO v_quantidade;

  RETURN v_quantidade <= p_limite;
END;
$$;

REVOKE ALL ON FUNCTION public.consumir_limite_olhar_cuidado(text, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.consumir_limite_olhar_cuidado(text, integer) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consumir_limite_olhar_cuidado(text, integer) TO service_role;