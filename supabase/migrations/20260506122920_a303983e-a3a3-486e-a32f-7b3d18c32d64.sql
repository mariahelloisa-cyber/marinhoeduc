-- Add 3 new profissionalizantes categories
INSERT INTO public.categories (slug, label, sort_order) VALUES
  ('profissionalizantes-premium', 'Profissionalizantes Premium', 9),
  ('profissionalizantes-avancado', 'Profissionalizantes Avançado', 10),
  ('profissionalizantes-comum', 'Profissionalizantes Comum', 11);

-- Move existing profissionalizantes courses to "comum" by default (admin can re-categorize)
UPDATE public.courses SET category_slug = 'profissionalizantes-comum' WHERE category_slug = 'profissionalizantes';

-- Remove the old generic profissionalizantes category
DELETE FROM public.categories WHERE slug = 'profissionalizantes';

-- Insert one test course in each new category
INSERT INTO public.courses (slug, name, category_slug, workload, sort_order) VALUES
  ('teste-profissionalizante-premium', 'CURSO TESTE PROFISSIONALIZANTE PREMIUM', 'profissionalizantes-premium', '40h', 0),
  ('teste-profissionalizante-avancado', 'CURSO TESTE PROFISSIONALIZANTE AVANÇADO', 'profissionalizantes-avancado', '40h', 0),
  ('teste-profissionalizante-comum', 'CURSO TESTE PROFISSIONALIZANTE COMUM', 'profissionalizantes-comum', '40h', 0);