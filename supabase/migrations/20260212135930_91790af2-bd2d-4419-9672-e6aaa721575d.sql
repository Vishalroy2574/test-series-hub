
-- Fix: restrict profile inserts to the trigger (no direct user inserts)
DROP POLICY "System inserts profiles" ON public.profiles;
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Fix: restrict role inserts
DROP POLICY "System inserts roles" ON public.user_roles;
CREATE POLICY "Users insert own role" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);
