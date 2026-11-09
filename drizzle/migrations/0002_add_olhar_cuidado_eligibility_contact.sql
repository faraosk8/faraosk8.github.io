ALTER TABLE public.inscricoes_olhar_cuidado
  ADD COLUMN via_programa_social boolean NOT NULL DEFAULT false,
  ADD COLUMN via_vulnerabilidade boolean NOT NULL DEFAULT false,
  ADD COLUMN programas_sociais text[] NOT NULL DEFAULT '{}',
  ADD COLUMN programa_outro text,
  ADD COLUMN declaracao_beneficiario boolean NOT NULL DEFAULT false,
  ADD COLUMN preferencia_contato text,
  ADD COLUMN contato_alternativo text,
  ADD COLUMN melhor_horario text;