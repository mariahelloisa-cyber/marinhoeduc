
-- Roles enum + tabela
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Categorias
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories public read" ON public.categories
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins insert categories" ON public.categories
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update categories" ON public.categories
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete categories" ON public.categories
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Cursos
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2),
  duration TEXT,
  workload TEXT,
  area TEXT,
  category_slug TEXT NOT NULL REFERENCES public.categories(slug) ON UPDATE CASCADE,
  image_url TEXT,
  highlight BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_courses_category ON public.courses(category_slug);
CREATE INDEX idx_courses_highlight ON public.courses(highlight) WHERE highlight = true;

CREATE POLICY "Courses public read" ON public.courses
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins insert courses" ON public.courses
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update courses" ON public.courses
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete courses" ON public.courses
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Conteúdo de páginas (Home/hero) - key/value JSONB
CREATE TABLE public.site_content (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site content public read" ON public.site_content
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins insert content" ON public.site_content
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update content" ON public.site_content
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete content" ON public.site_content
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER trg_courses_updated BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_content_updated BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Storage bucket público para mídia do admin
INSERT INTO storage.buckets (id, name, public) VALUES ('site-media', 'site-media', true);

CREATE POLICY "Site media public read" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'site-media');
CREATE POLICY "Admins upload media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update media" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete media" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));

-- Seed das categorias (slugs já usados no site)
INSERT INTO public.categories (slug, label, sort_order) VALUES
  ('cursos-tecnicos', 'Cursos técnicos', 1),
  ('tecnico-competencia', 'Técnico por competência', 2),
  ('pos-tecnico', 'Pós técnico', 3),
  ('tecnologo', 'Tecnólogo', 4),
  ('bacharelado', 'Bacharelado', 5),
  ('superior-sequencial', 'Superior sequencial', 6),
  ('mestrado', 'Mestrado', 7),
  ('pos-graduacao', 'Pós-graduação', 8),
  ('profissionalizantes', 'Profissionalizantes', 9);

-- Seed de conteúdo da Home
INSERT INTO public.site_content (key, value) VALUES
  ('hero', jsonb_build_object(
    'badge', 'Diploma reconhecido nacionalmente',
    'title', 'Transforme sua carreira em <highlight>instituições de referência nacional</highlight>',
    'subtitle', 'A Uniágape Educacional reúne mais de 4.000 cursos — de EJA e Cursos Técnicos a Bacharelados, Licenciaturas, Segundas Graduações e Pós-graduações.',
    'primary_button_label', 'Ver cursos disponíveis',
    'primary_button_target', 'cursos',
    'secondary_button_label', 'Saiba mais',
    'secondary_button_target', 'beneficios',
    'background_image_url', ''
  ));
