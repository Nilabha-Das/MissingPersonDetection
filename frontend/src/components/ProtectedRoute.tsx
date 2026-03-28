"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: "user" | "authority";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, initialized, user } = useAuth();
  const safePathname = pathname ?? "/";

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(safePathname)}`);
      return;
    }

    if (
      initialized &&
      isAuthenticated &&
      requiredRole &&
      user?.role !== requiredRole
    ) {
      const fallbackPath = user?.role === "authority" ? "/admin" : "/dashboard";
      router.replace(fallbackPath);
    }
  }, [
    initialized,
    isAuthenticated,
    requiredRole,
    router,
    safePathname,
    user?.role,
  ]);

  if (!initialized) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner label="Checking access..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-600">
        Redirecting to login...
      </div>
    );
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-600">
        Redirecting to your dashboard...
      </div>
    );
  }

  return <>{children}</>;
}
