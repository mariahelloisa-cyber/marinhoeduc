
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;

INSERT INTO public.categories (slug, label, sort_order, featured) VALUES
  ('cursos-tecnicos', 'Cursos técnicos', 1, true),
  ('tecnico-competencia', 'Técnico por competência', 2, true),
  ('pos-tecnico', 'Pós técnico', 3, true),
  ('tecnologo', 'Tecnólogo', 4, true),
  ('bacharelado', 'Bacharelado', 5, true),
  ('superior-sequencial', 'Superior sequencial', 6, true),
  ('mestrado', 'Mestrado', 7, false),
  ('pos-graduacao', 'Pós-graduação', 8, false),
  ('profissionalizantes', 'Profissionalizantes', 9, false)
ON CONFLICT (slug) DO NOTHING;
