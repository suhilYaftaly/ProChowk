import { format } from "date-fns";

export function decodeJwtToken(token: string | undefined) {
  if (token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  }
  return token;
}

export const getLocalData = (key: string) => {
  const saved = localStorage.getItem(key);
  if (saved && saved != "") return JSON.parse(saved);
  return "";
};

export function convertUnixToDate(unixDate: number | string | undefined) {
  const timestamp = Number(unixDate);
  if (Number.isNaN(timestamp)) return null;

  const fullDate = new Date(timestamp);

  // Format the date as "MMMM dd, yyyy"
  const monthDayYear = format(fullDate, "MMMM dd, yyyy");

  return { fullDate, monthDayYear };
}

export function transformCamelCase(input: string): string {
  // Use a regular expression to split the string at each uppercase letter
  const words: string[] = input.split(/(?=[A-Z])/);

  // Capitalize the first letter of each word and join them with spaces
  const formattedString: string = words
    .map((word: string) => {
      // Capitalize the first letter of the word
      const capitalizedWord: string =
        word.charAt(0).toUpperCase() + word.slice(1);
      return capitalizedWord;
    })
    .join(" ");

  return formattedString;
}

export function validateEmail(email: string): boolean {
  // Regular expression pattern for email validation
  const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  // Test the email against the pattern
  return emailPattern.test(email);
}
