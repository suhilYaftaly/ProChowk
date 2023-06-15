import { Prisma } from "@prisma/client";

export interface CreateContractorProfileInput {
  skills?: Skills[] | Prisma.JsonValue;
  licenses?: Licenses[] | Prisma.JsonValue;
}
export type Licenses = {
  name: string;
  size?: number;
  type: string;
  desc: string;
  picture: string;
};

export interface Contractor {
  id: string;
  skills?: Skills[] | Prisma.JsonValue;
  licenses?: Licenses[] | Prisma.JsonValue;
  user: ContractorUser;
}
export interface ContPropReturn {
  id: string;
  skills?: Skills[] | Prisma.JsonValue;
  licenses?: Licenses[] | Prisma.JsonValue;
}

export interface ContractorUser {
  id: string;
  name: string;
  email: string;
}

export type Skills = {
  id: string;
  label: string;
};
