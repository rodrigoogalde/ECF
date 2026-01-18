"use client";

import { useSession } from "@/lib/auth-client";
import { ROLE } from "@/lib/constants/roles";
import { UserRole } from "@prisma/client";
import { ReactNode } from "react";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Cargando...</div>;
  }

  if (!session) {
    return fallback;
  }

  if (session.user.role === ROLE.ADMIN || allowedRoles.includes(session.user.role)) {
    return <>{children}</>;
  }

  return fallback;
}
