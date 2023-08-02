import { GraphQLError } from "graphql";

interface IGQLError {
  msg: string;
  code?:
    | "BAD_REQUEST"
    | "BAD_USER_INPUT"
    | "GRAPHQL_PARSE_FAILED"
    | "GRAPHQL_VALIDATION_FAILED"
    | "INTERNAL_SERVER_ERROR"
    | "OPERATION_RESOLUTION_FAILURE"
    | "PERSISTED_QUERY_NOT_FOUND"
    | "PERSISTED_QUERY_NOT_SUPPORTED"
    | "UNAUTHENTICATED"
    | "FORBIDDEN";
}
export const gqlError = ({ msg, code }: IGQLError) => {
  return new GraphQLError(msg, { extensions: { code } });
};

export function validateEmail(email: string): boolean {
  const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailPattern.test(email);
}

export function validatePhoneNum(phoneNumber: string): boolean {
  const pattern = /^\d{3}-\d{3}-\d{4}$/;
  if (phoneNumber) return pattern.test(phoneNumber);
  return false;
}

export const getIErr = (msg: string) =>
  gqlError({ msg, code: "BAD_USER_INPUT" });
