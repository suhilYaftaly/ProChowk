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
  const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailPattern.test(email);
}

export const processImageFile = (
  file: File | undefined,
  onSuccess: (imageUrl: string) => void
) => {
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      onSuccess(imageUrl);
    };
    reader.readAsDataURL(file);
  }
};

export const processFile = (
  file: File | undefined,
  onSuccess: (fileData: string, fileType: string) => void
) => {
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const fileData = reader.result as string;
      const fileType = file.type;
      onSuccess(fileData, fileType);
    };

    // Read the file as base64
    reader.readAsDataURL(file);
  }
};

export function validatePhoneNum(phoneNumber: string | undefined): boolean {
  const pattern = /^\d{3}-\d{3}-\d{4}$/;
  if (phoneNumber) return pattern.test(phoneNumber);
  return false;
}

//format number to include dashes
export const formatPhoneNum = (phoneNumber: string): string => {
  const cleanedPhoneNumber = phoneNumber.replace(/\D/g, ""); // Remove non-digit characters

  let formattedPhoneNumber = "";
  for (let i = 0; i < cleanedPhoneNumber.length; i++) {
    if (i === 3 || i === 6) formattedPhoneNumber += "-";
    formattedPhoneNumber += cleanedPhoneNumber.charAt(i);
  }
  return formattedPhoneNumber;
};
