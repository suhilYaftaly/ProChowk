import { Role, UserType } from "@gqlOps/user";
import { getLocalData } from "./utilFuncs";
import { TOKENS_KEY } from "@/constants/localStorageKeys";
import { ITokens } from "@/types/commonTypes";

export const isSuperAdmin = (roles: Role[] | undefined) =>
  roles?.includes("superAdmin") || false;
export const isAdmin = (roles: Role[] | undefined): boolean =>
  roles?.includes("admin") || roles?.includes("superAdmin") || false;
export const isDeveloper = (roles: Role[] | undefined): boolean =>
  roles?.includes("dev") ||
  roles?.includes("admin") ||
  roles?.includes("superAdmin") ||
  false;

export const isContractor = (userTypes: UserType[] | undefined): boolean =>
  userTypes?.includes("contractor") || false;
export const isClient = (userTypes: UserType[] | undefined): boolean =>
  userTypes?.includes("client") || false;

export const getLocalTokens = (): ITokens | undefined =>
  getLocalData(TOKENS_KEY);
