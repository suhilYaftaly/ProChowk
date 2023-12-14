import React, { ChangeEvent } from "react";
import { TextField } from "@mui/material";
import { AsYouType } from "libphonenumber-js";

import { phoneCC } from "@/config/configConst";

interface Props {
  value: string | undefined;
  onChange: (value: string) => void;
  helperText?: string;
}

const PhoneTextField: React.FC<Props> = ({ value, onChange, helperText }) => {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputNumber = event.target.value;
    let formattedNumber;

    // Check if user is deleting characters and handle accordingly
    if (value && value.length > inputNumber.length) {
      formattedNumber = inputNumber;
    } else {
      formattedNumber = new AsYouType(phoneCC).input(inputNumber);
    }
    onChange(formattedNumber);
  };

  return (
    <TextField
      label="Phone Number"
      variant="outlined"
      size="small"
      name="phoneNum"
      value={value}
      onChange={handleInputChange}
      error={Boolean(helperText)}
      helperText={helperText}
      placeholder="e.g. +1 999-999-9999"
      fullWidth
    />
  );
};

export default PhoneTextField;
