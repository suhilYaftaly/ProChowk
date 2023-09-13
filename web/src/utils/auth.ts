import { Role } from "@gqlOps/user";

export const isSuperAdmin = (roles: Role[] | undefined) =>
  roles?.includes("superAdmin") || false;
export const isAdmin = (roles: Role[] | undefined): boolean =>
  roles?.includes("admin") || roles?.includes("superAdmin") || false;
export const isDeveloper = (roles: Role[] | undefined): boolean =>
  roles?.includes("dev") ||
  roles?.includes("admin") ||
  roles?.includes("superAdmin") ||
  false;
