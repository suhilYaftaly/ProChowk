import axios from "axios";
import { GraphQLError } from "graphql";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { ISignedProps } from "../middlewares/checkAuth";
import { appName, appNamePascalCase } from "../constants/constants";
import { logger } from "../middlewares/logger/logger";

dotenv.config();
const baseUrl = process.env.CLIENT_ORIGIN;

export interface IGQLError {
  msg: string;
  type?: "skipLogging";
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
export const gqlError = ({ msg, code, type }: IGQLError) => {
  return new GraphQLError(msg, { extensions: { code, type } });
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

interface ISendEmail {
  params: EmailParams;
  onSuccess?: () => void;
}
export const sendEmail = async ({ params, onSuccess }: ISendEmail) => {
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
    onSuccess && (await onSuccess());
    return response?.data;
  } catch (error) {
    const errMsg =
      "MailerSend: " + error?.response
        ? error?.response?.data?.message
        : error?.message;
    console.error(errMsg);
    throw gqlError({ msg: errMsg });
  }
};

interface IEmailTemplate {
  subject: string;
  message: string;
  buttonText: string;
  buttonLink: string;
  bottonInfoTxt?: string;
}

export const generateEmailTemplate = ({
  subject,
  message,
  buttonText,
  buttonLink,
  bottonInfoTxt = "If you did not request this, you can safely ignore this email.",
}: IEmailTemplate): string => {
  return `
    <div style="background-color: #f6f6f6; padding: 20px; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 4px; padding: 20px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center;">
          <img src="${baseUrl}/logo.png" alt="Logo" style="width: 100px;" />
          <h2 style="margin-top: 20px; color: #333333;">${subject}</h2>
        </div>
        <p style="font-size: 16px; line-height: 1.5; color: #666666; text-align: center;">
          ${message}
        </p>
        <div style="text-align: center;">
          <a href="${buttonLink}" style="background-color: #d94f14; color: #ffffff; font-size: 16px; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 20px; display: inline-block;">${buttonText}</a>
        </div>
        <p style="font-size: 14px; color: #999999; text-align: center; margin-top: 30px;">${bottonInfoTxt}</p>
      </div>
    </div>
  `;
};

interface IEmailFailureNoti {
  subject: string;
  message: string;
  buttonText: string;
}
export async function sendFailureEmailNotification({
  subject,
  message,
  buttonText,
}: IEmailFailureNoti) {
  const baseUrl = process.env.CLIENT_ORIGIN;
  const html = generateEmailTemplate({
    subject,
    message,
    buttonText,
    buttonLink: baseUrl + "/logs",
  });

  const params = {
    from: { email: `support@${appName}.com`, name: appNamePascalCase },
    to: [{ email: `suhail278@gmail.com`, name: "Admin" }],
    subject,
    text: message,
    html,
    variables: [],
  };

  return await sendEmail({
    params,
    onSuccess: () => logger.info(`Failure notification sent to admin.`),
  });
}

export const getUserFromContext = (ctx: any): ISignedProps => {
  const authHeader = ctx?.req?.headers?.authorization;
  const token = authHeader?.split("Bearer ")?.[1];
  return jwt.decode(token) as ISignedProps;
};

export const getClientIP = (req: any) => {
  const forwardedIpsStr = req?.header("x-forwarded-for");
  if (forwardedIpsStr) {
    // 'x-forwarded-for' header may return multiple IP addresses in
    // the format: "client IP, proxy 1 IP, proxy 2 IP"
    // Therefore, the client IP is the first one in the list
    return forwardedIpsStr.split(",")[0];
  }
  // If the request was not passed through any proxies, or if the platform does not
  // add the 'x-forwarded-for' header, then fall back to the remote address
  return req?.socket?.remoteAddress;
};

export const isDevEnv = process.env.NODE_ENV === "dev";
