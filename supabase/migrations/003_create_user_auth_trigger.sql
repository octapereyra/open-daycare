CREATE SCHEMA IF NOT EXISTS private;

REVOKE ALL ON SCHEMA private FROM PUBLIC;

CREATE OR REPLACE FUNCTION private.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_role_text text := NEW.raw_app_meta_data ->> 'role';
  v_daycare_id_text text := NEW.raw_app_meta_data ->> 'daycare_id';
  v_daycare_id uuid;
  v_full_name text := NEW.raw_user_meta_data ->> 'full_name';
  v_avatar_url text := NEW.raw_user_meta_data ->> 'avatar_url';
BEGIN
  IF v_role_text IS NULL OR v_role_text NOT IN ('staff', 'parent', 'admin') THEN
    RAISE EXCEPTION 'Invalid or missing user role';
  END IF;

  IF v_daycare_id_text IS NULL
    OR v_daycare_id_text !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  THEN
    RAISE EXCEPTION 'Invalid or missing daycare_id';
  END IF;

  v_daycare_id := v_daycare_id_text::uuid;

  IF NOT EXISTS (
    SELECT 1
    FROM public.daycares AS d
    WHERE d.id = v_daycare_id
  ) THEN
    RAISE EXCEPTION 'daycare_id does not reference an existing daycare';
  END IF;

  IF v_full_name IS NULL OR pg_catalog.btrim(v_full_name) = '' THEN
    RAISE EXCEPTION 'Invalid or missing full_name';
  END IF;

  INSERT INTO public.users (id, daycare_id, role, full_name, avatar_url)
  VALUES (NEW.id, v_daycare_id, v_role_text::public.user_role, v_full_name, v_avatar_url);

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION private.handle_new_user() FROM PUBLIC;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION private.handle_new_user();
