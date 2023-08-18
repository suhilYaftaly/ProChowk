import axios from "axios";
import { GraphQLError } from "graphql";
import * as dotenv from "dotenv";

dotenv.config();

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

export const showInputError = (msg: string) =>
  gqlError({ msg, code: "BAD_USER_INPUT" });

export interface EmailParams {
  from: {
    email: string;
    name: string;
  };
  to: {
    email: string;
    name: string;
  }[];
  subject: string;
  text: string;
  html: string;
  variables: {
    email: string;
    substitutions: {
      var: string;
      value: string;
    }[];
  }[];
}

export const sendEmail = async (params: EmailParams) => {
  const API_URL = "https://api.mailersend.com/v1/email";
  const API_KEY = process.env.MAILER_SEND_API_KEY;

  const data = {
    from: params.from,
    to: params.to,
    subject: params.subject,
    text: params.text,
    html: params.html,
    variables: params.variables,
  };

  const headers = {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(API_URL, data, { headers });
    return response.data;
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
