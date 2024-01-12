import axios from "axios";
import { GraphQLError, GraphQLResolveInfo } from "graphql";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";

import { ISignedProps } from "../middlewares/checkAuth";
import { appName, appNamePascalCase } from "../constants/constants";
import { logger } from "../middlewares/logger/logger";
import { GQLContext } from "../types/commonTypes";

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

/**
 * Checks if a phone number string is in E.164 format.
 *
 * The E.164 format is typically used for international phone numbers and
 * is characterized by a leading plus sign, followed by the country code
 * and the national phone number. This function validates the format, allowing
 * for spaces or dashes as optional separators.
 *
 * @param number - The phone number string to be validated.
 * @returns `true` if the phone number is in E.164 format, `false` otherwise.
 */
export function isE164PhoneNumber(number: string): boolean {
  // E.164 format regular expression
  // This pattern will match numbers like +1234567890, +12 345 678 9012, +123-456-7890
  const pattern = /^\+\d{1,3}(\s|-)?\d{1,12}((\s|-)?\d{1,4})?$/;

  if (number) return pattern.test(number);
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

export const getUserFromReq = (req: GQLContext["req"]): ISignedProps => {
  const authHeader = req?.headers?.authorization;
  const token = authHeader?.split("Bearer ")?.[1];
  return jwt.decode(token) as ISignedProps;
};

export const getClientIP = (req: GQLContext["req"]) => {
  const xForwardedFor = req?.headers?.["x-forwarded-for"];
  let ip: string | string[] | undefined = "";

  if (Array.isArray(xForwardedFor)) {
    ip = xForwardedFor[0]; // Take the first entry if it's an array
  } else if (typeof xForwardedFor === "string") {
    ip = xForwardedFor.split(",")[0]; // Split and take the first entry if it's a string
  }

  return ip || req?.ip;
};

export const isDevEnv = process.env.NODE_ENV === "dev";

/**
 * Converts a duration in seconds into a human-readable format.
 * The function breaks down the total duration into days, hours, minutes, and seconds,
 * and creates a string that combines these units in a reader-friendly manner.
 *
 * - For durations longer than a day, it shows days followed by hours.
 * - For durations of several hours (less than a day), it shows hours followed by minutes.
 * - For durations of less than an hour, it shows minutes and seconds.
 * - For durations of less than a minute, it shows just seconds.
 *
 * Each unit of time is pluralized correctly based on its value.
 *
 * @param {number} durationInSeconds - The total duration in seconds to be converted.
 * @return {string} A string representing the duration in a human-readable format.
 */
export function formatDuration(durationInSeconds: number) {
  let output = "";

  const days = Math.floor(durationInSeconds / 86400);
  const hours = Math.floor((durationInSeconds % 86400) / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = durationInSeconds % 60;

  if (days > 0) {
    output += `${days} day${days > 1 ? "s" : ""}`;
    if (hours > 0) {
      output += ` and ${hours} hour${hours > 1 ? "s" : ""}`;
    }
  } else if (hours > 0) {
    output += `${hours} hour${hours > 1 ? "s" : ""}`;
    if (minutes > 0) {
      output += ` and ${minutes} minute${minutes > 1 ? "s" : ""}`;
    }
  } else if (minutes > 0) {
    output += `${minutes} minute${minutes > 1 ? "s" : ""}`;
    if (seconds > 0) {
      output += ` and ${seconds} second${seconds > 1 ? "s" : ""}`;
    }
  } else {
    output = `${seconds} second${seconds > 1 ? "s" : ""}`;
  }

  return output;
}

/** ifr=isFieldRequested - use for conditional prisma includes to include documents if they have been requested from FE */
export const ifr = (info: GraphQLResolveInfo, fieldName: string): boolean => {
  return info.fieldNodes.some((node) =>
    node.selectionSet.selections.some(
      (selection) =>
        selection.kind === "Field" && selection.name.value === fieldName
    )
  );
};

//**infr isNestedFieldRequested - use for conditional prisma includes to include documents if they have been requested from FE */
export const infr = (
  info: GraphQLResolveInfo,
  parentFieldName: string,
  childFieldName: string
): boolean => {
  return info.fieldNodes.some((node) =>
    node.selectionSet.selections.some(
      (parentSelection) =>
        parentSelection.kind === "Field" &&
        parentSelection.name.value === parentFieldName &&
        parentSelection.selectionSet &&
        parentSelection.selectionSet.selections.some(
          (childSelection) =>
            childSelection.kind === "Field" &&
            childSelection.name.value === childFieldName
        )
    )
  );
};
