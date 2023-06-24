import { getErr, gqlError, validateEmail, validatePhoneNum } from "../funcs";
import {
  ILoginUserInput,
  IRegisterUserInput,
  IUpdateUserInputData,
  IUserAddress,
  UserImage,
} from "../../types/userTypes";

export const validateRegisterInput = ({
  name,
  password,
  // confirmPassword,
  email,
}: IRegisterUserInput) => {
  validateUserName(name);
  if (!validateEmail(email)) return getErr("Invalid email address");
  if (password === "") return getErr("Password must not be empty");
  // if (password !== confirmPassword) return getErr("Password must match");

  return undefined;
};

export const validateLoginInput = ({ email, password }: ILoginUserInput) => {
  if (!validateEmail(email)) return getErr("Invalid email address");
  if (password === "") return getErr("Password must not be empty");

  return undefined;
};

const validateUserName = (name: string) => {
  if (name.trim()?.length < 3) return getErr("Name must be more than 3 chars");
  return undefined;
};

const validateUserPhoneNum = (phoneNum: string) => {
  if (!validatePhoneNum(phoneNum)) {
    return getErr("Incorrect phone number format");
  }
  return undefined;
};

const validateUserImage = (image: UserImage) => {
  if (typeof image !== "object" || image === null) {
    return getErr("Invalid image format");
  }
  if (!("picture" in image)) {
    return getErr("Image must have a 'picture' field");
  }
  if (typeof image.picture !== "string" || image.picture.trim() === "") {
    return getErr("Image picture must be a non-empty string");
  }

  return undefined;
};

export const validateUpdateUser = ({
  name,
  bio,
  phoneNum,
  image,
  address,
  userType,
  existingUserType,
}: IUpdateUserInputData) => {
  let hasUpdates = false;
  const data: IUpdateUserInputData = {};

  if (name) {
    const nameErr = validateUserName(name);
    if (nameErr) return { error: nameErr };
    data.name = name;
    hasUpdates = true;
  }

  if (bio) {
    if (bio.trim()?.length < 10)
      return { error: getErr("bio must be more than 10 chars") };
    data.bio = bio;
    hasUpdates = true;
  }

  if (userType) {
    if (userType?.length < 1)
      return { error: getErr("User type cannot be empty") };
    if (existingUserType) {
      data.userType = [...(existingUserType as Array<any>), userType];
    } else data.userType = userType;
    hasUpdates = true;
  }

  if (phoneNum) {
    const numErr = validateUserPhoneNum(phoneNum);
    if (numErr) return { error: numErr };
    data.phoneNum = phoneNum;
    hasUpdates = true;
  }

  if (image) {
    const imageErr = validateUserImage(image);
    if (imageErr) return { error: imageErr };
    data.image = image;
    hasUpdates = true;
  }

  if (address) {
    const addressErr = validateUserAddress(address);
    if (addressErr) return { error: addressErr };
    data.address = address;
    hasUpdates = true;
  }

  if (!hasUpdates) {
    return {
      error: gqlError({
        msg: "No parameters provided to update",
        code: "BAD_USER_INPUT",
      }),
    };
  }

  return { data };
};

export const validateLatAndLng = (lat: string, lng: string) => {
  if (isNaN(Number(lat)) || isNaN(Number(lng))) {
    return getErr("Invalid latitude or longitude value");
  }
  return undefined;
};

const validateUserAddress = (address: IUserAddress) => {
  const {
    houseNum,
    road,
    neighbourhood,
    city,
    municipality,
    region,
    province,
    postalCode,
    country,
    countryCode,
    displayName,
    lat,
    lng,
  } = address;

  if (houseNum && houseNum?.trim() === "")
    return getErr("House number is required");
  if (road && road?.trim() === "") return getErr("Road is required");
  if (neighbourhood && neighbourhood?.trim() === "")
    return getErr("Neighbourhood is required");
  if (city && city?.trim() === "") return getErr("City is required");
  if (municipality && municipality?.trim() === "")
    return getErr("Municipality is required");
  if (region && region?.trim() === "") return getErr("Region is required");
  if (province && province?.trim() === "")
    return getErr("province is required");
  if (postalCode && postalCode?.trim() === "")
    return getErr("Postal code is required");
  if (country && country?.trim() === "") return getErr("Country is required");
  if (countryCode && countryCode?.trim() === "")
    return getErr("Country code is required");
  if (displayName && displayName?.trim() === "")
    return getErr("Display name is required");
  if (lat && isNaN(Number(lat))) return getErr("Invalid latitude value");
  if (lng && isNaN(Number(lng))) return getErr("Invalid longitude value");

  return undefined;
};
