"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/types";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const user = session?.user as
    | { id: string; name: string; email: string; role: UserRole; image?: string | null }
    | undefined;

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const isAdmin = user?.role === "ADMIN";

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const requireAuth = (redirectTo?: string) => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login${redirectTo ? `?callbackUrl=${redirectTo}` : ""}`);
      return false;
    }
    return true;
  };

  const requireAdmin = () => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push("/");
      return false;
    }
    return true;
  };

  return {
    user,
    session,
    status,
    isAuthenticated,
    isLoading,
    isAdmin,
    signIn,
    logout,
    requireAuth,
    requireAdmin,
  };
}
