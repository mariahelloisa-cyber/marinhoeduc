
DROP POLICY IF EXISTS "allow insert categories" ON public.categories;
DROP POLICY IF EXISTS "allow insert courses" ON public.courses;
DROP POLICY IF EXISTS "allow insert site_content" ON public.site_content;

DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
