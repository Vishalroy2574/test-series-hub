
-- Fix courses policies - drop restrictive, create permissive
DROP POLICY IF EXISTS "Anyone can view courses" ON public.courses;
DROP POLICY IF EXISTS "Admins insert courses" ON public.courses;
DROP POLICY IF EXISTS "Admins update courses" ON public.courses;
DROP POLICY IF EXISTS "Admins delete courses" ON public.courses;

CREATE POLICY "Anyone can view courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Admins can insert courses" ON public.courses FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update courses" ON public.courses FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete courses" ON public.courses FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix test_series policies
DROP POLICY IF EXISTS "Anyone can view test series" ON public.test_series;
DROP POLICY IF EXISTS "Admins insert test series" ON public.test_series;
DROP POLICY IF EXISTS "Admins update test series" ON public.test_series;
DROP POLICY IF EXISTS "Admins delete test series" ON public.test_series;

CREATE POLICY "Anyone can view test series" ON public.test_series FOR SELECT USING (true);
CREATE POLICY "Admins can insert test series" ON public.test_series FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update test series" ON public.test_series FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete test series" ON public.test_series FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix profiles policies
DROP POLICY IF EXISTS "Anyone can read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;

CREATE POLICY "Anyone can read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
