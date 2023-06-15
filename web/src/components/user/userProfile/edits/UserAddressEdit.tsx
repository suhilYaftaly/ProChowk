import { ChangeEvent, useEffect } from "react";
import { TextField } from "@mui/material";

import { IUserInfo } from "../UserInfo";
import { AddressInput } from "@/graphql/operations/user";

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
  useEffect(() => {
    setAddressData({ ...user?.address });
  }, [user]);

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setDisableSaveBtn(false);

    setAddressData({ ...addressData, [name]: value });
  };

  //TODO: add proper error handling and dropdown for province and country
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
      />
      <TextField
        label={"Street Name"}
        variant="outlined"
        size="small"
        name={"road"}
        value={addressData.road}
        onChange={handleAddressChange}
        placeholder={"your street name"}
      />
      <TextField
        label={"Neighbourhood"}
        variant="outlined"
        size="small"
        name={"neighbourhood"}
        value={addressData.neighbourhood}
        onChange={handleAddressChange}
        placeholder={"your neighbourhood"}
      />
      <TextField
        label={"City"}
        variant="outlined"
        size="small"
        name={"city"}
        value={addressData.city}
        onChange={handleAddressChange}
        placeholder={"your city"}
      />
      <TextField
        label={"Municipality"}
        variant="outlined"
        size="small"
        name={"municipality"}
        value={addressData.municipality}
        onChange={handleAddressChange}
        placeholder={"your municipality"}
      />
      <TextField
        label={"Region"}
        variant="outlined"
        size="small"
        name={"region"}
        value={addressData.region}
        onChange={handleAddressChange}
        placeholder={"your region"}
      />
      <TextField
        label={"Province"}
        variant="outlined"
        size="small"
        name={"province"}
        value={addressData.province}
        onChange={handleAddressChange}
        placeholder={"your province"}
      />
      <TextField
        label={"Postal Code"}
        variant="outlined"
        size="small"
        name={"postalCode"}
        value={addressData.postalCode}
        onChange={handleAddressChange}
        placeholder={"your postalCode"}
      />
      <TextField
        label={"Country"}
        variant="outlined"
        size="small"
        name={"country"}
        value={addressData.country}
        onChange={handleAddressChange}
        placeholder={"your country"}
      />
    </>
  );
}
