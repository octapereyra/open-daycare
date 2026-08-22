import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const createClient = (
  cookieStore: Awaited<ReturnType<typeof cookies>>,
) => {
  return createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Components cannot write cookies; the proxy refreshes them.
        }
      },
    },
  });
};

export const getUserClaims = async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase.auth.getClaims();

  return data?.claims ?? null;
};

export interface UserProfile {
  fullName: string;
  role: string;
  daycareName: string;
  initial: string;
}

export const getUserProfile = async (): Promise<UserProfile | null> => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: claims } = await supabase.auth.getClaims();

  if (!claims?.claims?.sub) return null;

  const userId = claims.claims.sub;

  const { data, error } = await supabase
    .from('users')
    .select('full_name, role, daycares(name)')
    .eq('id', userId)
    .single();

  if (error || !data) return null;

  const fullName = data.full_name ?? '';
  const initial = fullName.charAt(0).toUpperCase();
  const daycares = data.daycares as { name: string }[] | null;
  const daycareName = daycares?.[0]?.name ?? '';

  return {
    fullName,
    role: data.role,
    daycareName,
    initial,
  };
};
