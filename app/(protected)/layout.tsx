import { redirect } from 'next/navigation';

import { getUserClaims, getUserProfile } from '@/utils/supabase/server';
import { UserProvider } from '@/components/shared/UserContext';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const claims = await getUserClaims();

  if (!claims) {
    redirect('/login');
  }

  const profile = await getUserProfile();

  return (
    <UserProvider user={profile!}>
      {children}
    </UserProvider>
  );
}
