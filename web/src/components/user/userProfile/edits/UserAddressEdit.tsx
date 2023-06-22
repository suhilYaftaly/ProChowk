import { ChangeEvent, useEffect, useState } from "react";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

import { IUserInfo } from "../UserInfo";
import { AddressInput } from "@gqlOps/user";
import { canadianProvinces } from "@config/data";

interface Props extends IUserInfo {
  addressData: AddressInput;
  setAddressData: (addressData: AddressInput) => void;
  setDisableSaveBtn: (disable: boolean) => void;
}

export default function UserAddressEdit({
  user,
  addressData,
  setAddressData,
  setDisableSaveBtn,
}: Props) {
  const [errors, setErrors] = useState<AddressInput>({
    houseNum: "",
    road: "",
    neighbourhood: "",
    city: "",
    municipality: "",
    region: "",
    province: "",
    postalCode: "",
  });

  useEffect(() => {
    setAddressData({ ...user?.address });
  }, [user]);

  useEffect(() => {
    const hasErrors = Object.values(errors).some((error) => Boolean(error));
    setDisableSaveBtn(hasErrors);
  }, [errors, setDisableSaveBtn]);

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    const updatedAddressData = {
      ...addressData,
      [name]: value,
    };

    setAddressData(updatedAddressData);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(value, name as keyof AddressInput),
    }));
  };

  const handleProvinceChange = (_: ChangeEvent<{}>, value: string | null) => {
    const updatedAddressData = {
      ...addressData,
      province: value || "",
    };

    setAddressData(updatedAddressData);
    setErrors((prevErrors) => ({
      ...prevErrors,
      province: validateField(value || "", "province"),
    }));
  };

  const validateField = (value: string, fieldName: keyof AddressInput) => {
    let error = "";

    switch (fieldName) {
      case "houseNum":
        if (value && !/^\d+$/.test(value)) {
          error = "Unit Number should only contain numbers";
        }
        break;
      case "road":
      case "neighbourhood":
      case "city":
      case "municipality":
      case "region":
        if (value && value.length < 3) {
          error = `${fieldName} should have at least 3 characters`;
        }
        break;
      case "province":
        if (value && !canadianProvinces.includes(value.trim())) {
          error = "Invalid province";
        }
        break;
      case "postalCode":
        const postalCodeRegex = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;
        if (value && !postalCodeRegex.test(value)) {
          error = "Invalid postal code, should be in the format (L1T 4C7)";
        }
        break;
      default:
        break;
    }

    return error;
  };

  return (
    <>
      <TextField
        label={"Unit Number"}
        variant="outlined"
        size="small"
        name={"houseNum"}
        value={addressData.houseNum}
        onChange={handleAddressChange}
        placeholder={"your unit number"}
        type="number"
        error={Boolean(errors.houseNum)}
        helperText={errors.houseNum}
      />
      <TextField
        label={"Street Name"}
        variant="outlined"
        size="small"
        name={"road"}
        value={addressData.road}
        onChange={handleAddressChange}
        placeholder={"your street name"}
        error={Boolean(errors.road)}
        helperText={errors.road}
      />
      <TextField
        label={"Neighbourhood"}
        variant="outlined"
        size="small"
        name={"neighbourhood"}
        value={addressData.neighbourhood}
        onChange={handleAddressChange}
        placeholder={"your neighbourhood"}
        error={Boolean(errors.neighbourhood)}
        helperText={errors.neighbourhood}
      />
      <TextField
        label={"City"}
        variant="outlined"
        size="small"
        name={"city"}
        value={addressData.city}
        onChange={handleAddressChange}
        placeholder={"your city"}
        error={Boolean(errors.city)}
        helperText={errors.city}
      />
      <TextField
        label={"Municipality"}
        variant="outlined"
        size="small"
        name={"municipality"}
        value={addressData.municipality}
        onChange={handleAddressChange}
        placeholder={"your municipality"}
        error={Boolean(errors.municipality)}
        helperText={errors.municipality}
      />
      <TextField
        label={"Region"}
        variant="outlined"
        size="small"
        name={"region"}
        value={addressData.region}
        onChange={handleAddressChange}
        placeholder={"your region"}
        error={Boolean(errors.region)}
        helperText={errors.region}
      />
      <Autocomplete
        options={canadianProvinces}
        getOptionLabel={(option) => option}
        renderInput={(params) => (
          <TextField
            {...params}
            label={"Province"}
            variant="outlined"
            size="small"
            name={"province"}
            value={addressData.province}
            onChange={handleAddressChange}
            placeholder={"your province"}
            error={Boolean(errors.province)}
            helperText={errors.province}
          />
        )}
        onChange={handleProvinceChange}
      />
      <TextField
        label={"Postal Code"}
        variant="outlined"
        size="small"
        name={"postalCode"}
        value={addressData.postalCode}
        onChange={handleAddressChange}
        placeholder={"...L1T 4C7"}
        error={Boolean(errors.postalCode)}
        helperText={errors.postalCode}
      />
      <TextField
        label={"Country"}
        variant="outlined"
        size="small"
        name={"country"}
        value={addressData.country || "Canada"}
        onChange={handleAddressChange}
        placeholder={"your country"}
        disabled
      />
    </>
  );
}
