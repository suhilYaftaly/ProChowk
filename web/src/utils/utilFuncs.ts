import { IUserData } from "@/graphql/operations/user";
import { paths } from "@/routes/PageRoutes";
import { format, startOfDay } from "date-fns";
import { NavigateFunction } from "react-router-dom";

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
  onSuccess: (imageUrl: string) => void,
  maxSize = 1024
) => {
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const aspectRatio = image.width / image.height;
        let width = image.width;
        let height = image.height;

        // Calculate new dimensions if the image exceeds the maxSize
        if (width > maxSize || height > maxSize) {
          if (aspectRatio > 1) {
            width = maxSize;
            height = width / aspectRatio;
          } else {
            height = maxSize;
            width = height * aspectRatio;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        // Draw the image on the canvas with the new dimensions
        if (ctx) {
          ctx.drawImage(image, 0, 0, width, height);
          const resizedImageUrl = canvas.toDataURL(file.type);
          onSuccess(resizedImageUrl);
        }
      };

      image.src = imageUrl;
    };
    reader.readAsDataURL(file);
  }
};

export const processPDFFile = (
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

export const openUserIfNewUser = ({
  user,
  navigate,
}: {
  user: IUserData | undefined;
  navigate: NavigateFunction;
}) => {
  if (
    user &&
    convertUnixToDate(user?.createdAt)?.fullDate.toDateString() ==
      startOfDay(new Date()).toDateString()
  ) {
    const username = `${user.name}-${user.id}`.replace(/\s/g, "");
    navigate(paths.user(username));
    console.log(paths.user(username), "here");
  } else navigate("/");
};
