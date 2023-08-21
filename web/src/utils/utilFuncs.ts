import { format, startOfDay } from "date-fns";
import { NavigateFunction } from "react-router-dom";

import { IUser } from "@gqlOps/user";
import { paths } from "@/routes/Routes";
import { IAddress } from "@gqlOps/address";

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

interface IPIFOnSuccess {
  imageUrl: string;
  fileSize: number;
}
interface IPIF {
  file: File | undefined;
  maxSize?: number;
  onSuccess: ({ imageUrl, fileSize }: IPIFOnSuccess) => void;
}
export const processImageFile = ({ file, onSuccess, maxSize = 1024 }: IPIF) => {
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
          const fileSize = resizedImageUrl.length * 0.75; // Calculating the new file size in bytes (assuming Base64 encoding)
          onSuccess({ imageUrl: resizedImageUrl, fileSize: fileSize });
        }
      };

      image.src = imageUrl;
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
  user: IUser | undefined;
  navigate: NavigateFunction;
}) => {
  if (!user?.emailVerified) {
    navigate(paths.verifyEmail);
  } else {
    if (
      user &&
      convertUnixToDate(user?.createdAt)?.fullDate.toDateString() ==
        startOfDay(new Date()).toDateString()
    ) {
      const username = `${user.name}-${user.id}`.replace(/\s/g, "");
      navigate(paths.user(username));
    } else navigate("/");
  }
};

interface IUserLocation {
  onSuccess: ({ lat, lng }: { lat: number; lng: number }) => void;
  onError?: (msg: string) => void;
}
export const getUserLocation = ({ onSuccess, onError }: IUserLocation) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        onSuccess({ lat, lng });
      },
      (error) => {
        onError && onError("Location permission denied: " + error);
        console.error("Location permission denied:", error);
      }
    );
  } else {
    onError && onError("Geolocation is not supported by this browser.");
    console.error("Geolocation is not supported by this browser.");
  }
};

export function formatBytes(bytes: number): string {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log2(bytes) / 10);
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

export const removeTypename = (obj: any): any => {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(removeTypename);

  // Create a new object without the __typename property
  const newObj = Object.entries(obj).reduce((acc, [key, value]) => {
    if (key !== "__typename") acc[key] = removeTypename(value);
    return acc;
  }, {} as any);

  return newObj;
};

export const removeServerMetadata = ({ obj }: { obj: any }): any => {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj))
    return obj.map((item) => removeServerMetadata({ obj: item }));

  // Create a new object without the specified properties
  const newObj = Object.entries(obj).reduce((acc, [key, value]) => {
    if (
      key !== "__typename" &&
      key !== "id" &&
      key !== "createdAt" &&
      key !== "updatedAt"
    ) {
      acc[key] = removeServerMetadata({ obj: value });
    }
    return acc;
  }, {} as any);

  return newObj;
};

export const getBasicAdd = (address: IAddress) => {
  let add = "";
  if (address?.city) add += address?.city + ", ";
  if (address?.county) add += address?.county + ", ";
  if (address?.country) add += address?.country;
  return add;
};

export const openPhone = (num: string | undefined) => {
  if (num) window.location.href = `tel:${num}`;
};

interface IOpenEmail {
  email: string;
  subject?: string;
  body?: string;
}
export const openEmail = ({ email, subject, body }: IOpenEmail) => {
  let mailtoURL = `mailto:${encodeURIComponent(email)}`;

  if (subject) mailtoURL += `?subject=${encodeURIComponent(subject)}`;
  if (body) {
    if (subject) {
      mailtoURL += `&body=${encodeURIComponent(body)}`;
    } else {
      mailtoURL += `?body=${encodeURIComponent(body)}`;
    }
  }

  window.location.href = mailtoURL;
};

export const openEmailClient = () => {
  const a = document.createElement("a");
  a.href = "data:message/rfc822,";
  a.download = "";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

interface ITrimTxt {
  text: string;
  maxLength?: number;
}
export const trimText = ({ text, maxLength = 200 }: ITrimTxt) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

export const isMobileDevice = () => {
  const hasTouchScreen =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const userAgent = navigator.userAgent;
  const isMobileUA =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent
    );
  return hasTouchScreen && isMobileUA;
};
