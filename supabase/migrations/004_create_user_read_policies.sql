CREATE OR REPLACE FUNCTION private.can_read_daycare_users(target_daycare_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users AS viewer
    WHERE viewer.id = (SELECT auth.uid())
      AND viewer.daycare_id = target_daycare_id
      AND viewer.role IN ('staff'::public.user_role, 'admin'::public.user_role)
  );
$$;

REVOKE ALL ON FUNCTION private.can_read_daycare_users(uuid) FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO authenticated;
GRANT EXECUTE ON FUNCTION private.can_read_daycare_users(uuid) TO authenticated;

CREATE POLICY "users_read_own"
ON public.users
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = id);

CREATE POLICY "users_read_same_daycare_staff"
ON public.users
FOR SELECT
TO authenticated
USING ((SELECT private.can_read_daycare_users(daycare_id)));
