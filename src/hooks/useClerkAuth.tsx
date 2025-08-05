import { useUser, useAuth as useClerkAuth } from "@clerk/clerk-react";

export const useAuth = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerkAuth();

  return {
    user,
    loading: !isLoaded,
    isAdmin: user?.publicMetadata?.role === 'admin',
    signOut
  };
};