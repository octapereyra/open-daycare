'use client';

import { createContext, useContext } from 'react';
import type { UserProfile } from '@/utils/supabase/server';

const UserContext = createContext<UserProfile | null>(null);

export function UserProvider({
  user,
  children,
}: {
  user: UserProfile;
  children: React.ReactNode;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser(): UserProfile {
  const user = useContext(UserContext);
  if (!user) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return user;
}
