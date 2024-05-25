import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  format,
  isValid,
  parseISO,
} from 'date-fns';
import * as Location from 'expo-location';
import 'core-js/stable/atob';
import { IAddress } from '@gqlOps/address';
import { getValueFromLocalStorage } from './secureStore';
import { jwtDecode } from 'jwt-decode';
import { INearbyContFilters } from '../components/user/drawer/ContrFilterDrawer';
import * as ImagePicker from 'expo-image-picker';
import { Linking } from 'react-native';
import { IImage } from '../types/commonTypes';
/* import { GoogleSignin } from '@react-native-google-signin/google-signin'; */
import { INearByJobFilters } from '../components/user/contractor/ContractorHome';

export function decodeJwtToken(token: string) {
  /* const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    ); */
  const decoded = jwtDecode(token);
  return decoded;
}

export const getLocalData = (key: string) => {
  const saved = getValueFromLocalStorage(key);
  if (saved && saved != '') return JSON.parse(saved);
  return '';
};

export function transformCamelCase(input: string): string {
  // Use a regular expression to split the string at each uppercase letter
  const words: string[] = input.split(/(?=[A-Z])/);

  // Capitalize the first letter of each word and join them with spaces
  const formattedString: string = words
    .map((word: string) => {
      // Capitalize the first letter of the word
      const capitalizedWord: string = word.charAt(0).toUpperCase() + word.slice(1);
      return capitalizedWord;
    })
    .join(' ');

  return formattedString;
}

export function validateEmail(email: string): boolean {
  const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailPattern.test(email);
}

/**return a string of all unmet conditions */
export function validatePassword(password: string): string {
  const errors = [];

  if (password.length < 8) {
    errors.push('Must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Must contain an uppercase letter (A-Z)');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Must contain a lowercase letter (a-z)');
  }
  if (!/\d/.test(password)) {
    errors.push('Must contain a digit (0-9)');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Must contain a special character (!@#$%^&*(),.?":{}|<>)');
  }

  return errors.join(' | ');
}

interface IPIFOnSuccess {
  imageUrl: string;
  fileSize: number;
}
interface IPIF {
  file: File | undefined;
  maxSize?: number;
  /**
   * Optional file type for the output image.
   * For example, 'image/jpeg' or 'image/png'.
   * If not specified, the original file's type will be used.
   */
  fileType?: string; // Optional file type for the output image
  /** Optional quality for the output image (relevant for 'image/jpeg') */
  quality?: number;
}
export const processImageFile = ({
  file,
  maxSize = 1024,
  fileType,
  quality = 1,
}: IPIF): Promise<IPIFOnSuccess> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('No file provided');
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(imageUrl);

      const canvas = document.createElement('canvas');
      const aspectRatio = image.width / image.height;
      let width = image.width;
      let height = image.height;

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
      const ctx = canvas?.getContext('2d');

      if (ctx) {
        ctx.drawImage(image, 0, 0, width, height);
        const outputMimeType = fileType || file.type;
        const resizedImageUrl = canvas.toDataURL(outputMimeType, quality);
        const fileSize = (3 * resizedImageUrl.length) / 4;
        resolve({ imageUrl: resizedImageUrl, fileSize });
      } else reject('Failed to get canvas context');
    };

    image.onerror = () => reject('Error loading image');
    image.src = imageUrl;
  });
};

/* interface INavigateToOnLogin {
  user: IUser | undefined;
  navigate: NavigateFunction;
} */
/**Navigate to the right page after login */
/* export const navigateToOnLogin = ({ user, navigate }: INavigateToOnLogin) => {
  if (!user) {
    navigate(paths.login);
  } else if (user.userTypes?.length < 1) {
    navigate(paths.profileSetup());
  } else if (!user?.emailVerified) {
    navigate(paths.verifyEmail);
  } else navigate('/');
}; */

/* interface INavigateToUserPage {
  user: IUser | undefined;
  navigate: NavigateFunction;
}
export const navigateToUserPage = ({ user, navigate }: INavigateToUserPage) => {
  if (user) {
    const username = `${user.name}-${user.id}`.replace(/\s/g, '');
    navigate(paths.user(username));
  }
}; */

export const googleLogout = async () => {
  /* const isSignedIn = await GoogleSignin.isSignedIn();

  if (!isSignedIn) {
    await GoogleSignin.signOut();
  } */
};

interface IUserLocation {
  onSuccess: ({ lat, lng }: { lat: number; lng: number }) => void;
  onError?: (msg: any) => void;
}

export const getUserLocation = async ({ onSuccess }: IUserLocation) => {
  let currentLocation = await Location.getCurrentPositionAsync({});
  const { latitude: lat, longitude: lng } = currentLocation?.coords;
  onSuccess({ lat, lng });
};

export function formatBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log2(bytes) / 10);
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

export const removeTypename = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(removeTypename);

  // Create a new object without the __typename property
  const newObj = Object.entries(obj).reduce((acc, [key, value]) => {
    if (key !== '__typename') acc[key] = removeTypename(value);
    return acc;
  }, {} as any);

  return newObj;
};

export const removeServerMetadata = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map((item) => removeServerMetadata(item));

  // Create a new object without the specified properties
  const newObj = Object.entries(obj).reduce((acc, [key, value]) => {
    if (key !== '__typename' && key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
      acc[key] = removeServerMetadata(value);
    }
    return acc;
  }, {} as any);

  return newObj;
};

export const getBasicAdd = (address: IAddress) => {
  let add = '';
  if (address?.city) add += address?.city + ', ';
  if (address?.county) add += address?.county + ', ';
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

  window.open(mailtoURL, '_blank');
};

interface ITrimTxt {
  text: string;
  maxLength?: number;
}
export const trimText = ({ text, maxLength = 200 }: ITrimTxt) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};

export const isMobileDevice = () => {
  const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const userAgent = navigator.userAgent;
  const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    userAgent
  );
  return hasTouchScreen && isMobileUA;
};

type TimeCalculationMode = 'since' | 'until';

/**
 * @param {string} timestamp - The ISO 8601 date string to calculate the relative time for.
 * @param {TimeCalculationMode} [mode='since'] - The mode of calculation:
 *  - 'since': Calculates the time passed since the date.
 *  - 'until': Calculates the time remaining until the date.
 * @return {string} The formatted relative time string as a string in the format of "1s", "1m", "1hr", "5hrs", "1day", "5days", etc.
 */
export function formatRelativeTime(timestamp: string, mode: TimeCalculationMode = 'since'): string {
  const now = new Date();
  const date = parseISO(timestamp);

  // Determine the order of dates based on the mode
  const [date1, date2] = mode === 'until' ? [date, now] : [now, date];

  const seconds = differenceInSeconds(date1, date2);
  if (seconds < 60) return `${seconds}s`;

  const minutes = differenceInMinutes(date1, date2);
  if (minutes < 60) return `${minutes}m`;

  const hours = differenceInHours(date1, date2);
  if (hours < 24) return `${hours}hr`;

  const days = differenceInDays(date1, date2);
  return `${days}d`;
}

interface IConvertISODate {
  /**
   * format string e.g yyyy-MM-dd
   * @default 'MMM dd, yyyy hh:mm a'
   */
  fs?: string;
}
/**
 * Formats an ISO date string to a more human-readable format
 * @param date - The date string in ISO format ("YYYY-MM-DDTHH:mm:ss")
 * @returns A string formatted as requested format e.g 'yyyy-MM-dd hh:mm:ss a'
 */
export const readISODate = (
  date: string | undefined,
  { fs = 'MMM dd, yyyy' }: IConvertISODate = {}
): string => {
  if (!date) return 'Invalid date';

  const parsedDate = parseISO(date);
  if (!isValid(parsedDate)) return 'Invalid date';

  return format(parsedDate, fs);
};

/**Helper function to estimate the size of a base64 encoded string in bytes */
export const estimateBase64Size = (base64String: string) => {
  return (
    base64String.length * (3 / 4) -
    (base64String.endsWith('==') ? 2 : base64String.endsWith('=') ? 1 : 0)
  );
};

interface Props {
  lat: number;
  lng: number;
}
/**Google Maps directions URL format with driving mode selected */
export const openGoogleMapsDirections = ({ lat, lng }: Props) => {
  const url = `https://www.google.com/maps/dir/?api=1&origin=current+location&destination=${lat},${lng}&travelmode=driving`;
  window.open(url, '_blank');
};

/**
 * Formats a phone number to E.164 format.
 * @param number - The phone number to format.
 * @param CC     - ISO 3166-1 alpha-2 country code, defaults to 'CA'.
 * @returns The phone number in E.164 format, or null if invalid.
 */
/* export const formatToE164 = (
  number: string | undefined,
  CC: CountryCode = phoneCC
) => {
  if (!number) return number;
  const phoneNumber = parsePhoneNumberFromString(number, CC);

  if (phoneNumber?.isValid()) return phoneNumber.number;
  else {
    console.error("Invalid phone number");
    return number;
  }
}; */

/**
 * Formats a phone number to a human-readable international format.
 *
 * @param number - The phone number in E.164 format or national format.
 * @param phoneCC - ISO 3166-1 alpha-2 country code, e.g., 'CA'.
 * @returns The formatted phone number in international format.
 */
/* export const formatPhoneNumber = (number: string | undefined) => {
  if (!number) return number;
  try {
    const parsedNumber = parsePhoneNumberFromString(number, phoneCC);
    if (parsedNumber && parsedNumber.isValid()) {
      return parsedNumber.formatInternational();
    }
  } catch (error) {
    console.error("Error parsing phone number:", error);
  }
  return number;
}; */

/** Display remaining character count, e.g., (5/1000) */
export const charsCount = (text: string | undefined, max: number) => {
  if (text) return `(${text.length}/${max})`;
  return `(0/${max})`;
};

export function splitCamelCase(input: string | undefined) {
  if (!input) return input;
  return (
    input
      // Insert a space before all caps (except for the very first character if it's uppercase)
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // Replace any underscores or hyphens with a space
      .replace(/[_\-]+/g, ' ')
      // Capitalize the first character if the original string was PascalCase
      .replace(/^./, (str) => str.toUpperCase())
  );
}

export const isFiltersChanged = (
  currFilters: INearbyContFilters,
  prevFilters: INearbyContFilters
) => {
  if (
    currFilters?.radius !== prevFilters?.radius ||
    currFilters?.latLng?.lat !== prevFilters?.latLng?.lat ||
    currFilters?.latLng?.lng !== prevFilters?.latLng?.lng
  )
    return true;
  return false;
};

export const isProjectFiltersChanged = (
  currFilters: INearByJobFilters,
  prevFilters: INearByJobFilters
) => {
  if (
    currFilters?.radius !== prevFilters?.radius ||
    currFilters?.latLng?.lat !== prevFilters?.latLng?.lat ||
    currFilters?.latLng?.lng !== prevFilters?.latLng?.lng ||
    currFilters?.seleDayPosted !== prevFilters?.seleDayPosted ||
    currFilters?.seleProjectType !== prevFilters?.seleProjectType ||
    currFilters?.budget?.from !== prevFilters?.budget?.from ||
    currFilters?.budget?.to !== prevFilters?.budget?.to
  )
    return true;
  return false;
};

export const getImageFromAlbum = async (isMultiple: boolean = false) => {
  let filePemission = await ImagePicker.getMediaLibraryPermissionsAsync();
  if (!filePemission.granted && filePemission?.canAskAgain) {
    filePemission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  } else if (!filePemission.granted && !filePemission?.canAskAgain) {
    Linking.openSettings();
  }
  if (filePemission?.accessPrivileges === 'all' || filePemission?.granted) {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: isMultiple,
      base64: true,
      allowsEditing: !isMultiple,
      aspect: [4, 3],
    });
    if (!result.canceled) {
      if (!isMultiple && result?.assets?.[0]) return result?.assets?.[0];
      else if (isMultiple && result?.assets?.length > 0) return result?.assets;
      else return null;
    } else return '';
  }
};

export const getRandomString = (length: number = 5) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
