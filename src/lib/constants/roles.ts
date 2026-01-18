export const ROLE = {
  ADMIN: "ADMIN",
  STUDENT: "STUDENT",
} as const;

export type RoleType = typeof ROLE[keyof typeof ROLE];
