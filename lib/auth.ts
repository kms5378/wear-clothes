import type { UserRole } from "@/lib/types";

export type SessionUser = {
  id: string;
  role: UserRole;
};

export function canAccessCustomer(user: SessionUser | null | undefined) {
  return user?.role === "customer" || user?.role === "admin";
}

export function canAccessAdmin(user: SessionUser | null | undefined) {
  return user?.role === "admin";
}

export function requireAdmin(user: SessionUser | null | undefined) {
  if (!canAccessAdmin(user)) {
    throw new Error("Admin role required");
  }

  return user;
}
