
-- 1) Fix search_path em set_updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- 2) Bucket: remove SELECT amplo, mantém leitura pública via URL pública (bucket public=true permite GET por URL)
DROP POLICY "Site media public read" ON storage.objects;
-- Sem policy SELECT, listing está bloqueado; arquivos continuam acessíveis via URL pública porque o bucket é público.

-- 3) Revoga EXECUTE de has_role para roles públicos; mantém apenas para postgres (usado via SECURITY DEFINER em RLS)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
