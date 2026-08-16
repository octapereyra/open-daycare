DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE CONSTRAINT TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW
  EXECUTE FUNCTION private.handle_new_user();
