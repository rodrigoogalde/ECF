import { auth } from "@/lib/auth";
import { ROLE } from "@/lib/constants/roles";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  if (session.user.role !== ROLE.ADMIN) {
    redirect("/unauthorized");
  }
  return session;
}

export async function requireRole(role: UserRole) {
  const session = await requireAuth();
  if (session.user.role !== role && session.user.role !== ROLE.ADMIN) {
    redirect("/unauthorized");
  }
  return session;
}

export function isAdmin(role: UserRole): boolean {
  return role === ROLE.ADMIN;
}

export function isStudent(role: UserRole): boolean {
  return role === ROLE.STUDENT;
}

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  if (userRole === ROLE.ADMIN) return true;
  return userRole === requiredRole;
}
