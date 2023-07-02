import { Prisma } from "@prisma/client";

export interface CreateContractorProfileInput {
  skills?: Skill[] | Prisma.JsonValue;
  licenses?: License[] | Prisma.JsonValue;
}
export type License = {
  name: string;
  size?: number;
  type: string;
  desc: string;
  picture: string;
};

export interface Contractor {
  id: string;
  skills?: Skill[] | Prisma.JsonValue;
  licenses?: License[] | Prisma.JsonValue;
  user: ContractorUser;
  createdAt: string;
  updatedAt: string;
}
export interface ContPropReturn {
  id: string;
  skills?: Skill[] | Prisma.JsonValue;
  licenses?: License[] | Prisma.JsonValue;
  createdAt: string | any;
  updatedAt: string | any;
}

export interface ContractorUser {
  id: string;
  name: string;
  email: string;
}

export type Skill = {
  label: string;
};
