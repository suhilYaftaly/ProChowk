import { Avatar, Button, Stack, TextField, Typography } from "@mui/material";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { useUserStates } from "../../../../redux/reduxStates";
import {
  convertUnixToDate,
  transformCamelCase,
  validateEmail,
} from "../../../../utils/utilFuncs";
import { useAppDispatch, useGetSSV } from "../../../../utils/hooks";
import { setUserProfile } from "../../../../redux/slices/userSlice";

export default function MyInfo() {
  const dispatch = useAppDispatch();
  const { user } = useUserStates();
  const [disableSaveBtn, setDisableSaveBtn] = useState(true);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  useEffect(() => {
    if (user)
      setFormData({
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
      });
  }, [user]);

  const handleFDataChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setDisableSaveBtn(false);
    setFormData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSave = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (formData.firstName && formData.lastName && formData.email) {
      dispatch(
        setUserProfile({
          ...(user as any),
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`,
        })
      );
      setDisableSaveBtn(true);
    }
  };

  const isEmailInvalid = !validateEmail(formData.email);

  interface TFItems {
    name: keyof typeof formData;
    isError: boolean;
    helperText?: string;
  }
  const tfItems: TFItems[] = [
    { name: "firstName", isError: formData.firstName.length < 3 },
    { name: "lastName", isError: formData.lastName.length < 3 },
    {
      name: "email",
      isError: isEmailInvalid,
      helperText: isEmailInvalid ? "Invalid email format" : "",
    },
  ];

  //if there are any error in the form then disable the save button
  useEffect(() => {
    const hasErrors = tfItems.some((item) => item.isError);
    if (hasErrors) setDisableSaveBtn(hasErrors);
  }, [formData, tfItems]);

  return (
    <>
      <Stack
        direction={useGetSSV("column", "row")}
        sx={{ alignItems: "center" }}
        spacing={2}
      >
        <Avatar
          alt={user?.name}
          src={user?.picture}
          sx={{ width: 100, height: 100 }}
        />
        <Stack sx={{ textAlign: useGetSSV("center", "left") }}>
          <Typography>{user?.name}</Typography>
          <Typography>
            Joined {convertUnixToDate(user?.dateJoined)?.monthDayYear}
          </Typography>
        </Stack>
      </Stack>
      <Stack
        component="form"
        sx={{ mt: 3 }}
        spacing={2}
        noValidate
        autoComplete="off"
        onSubmit={handleSave}
      >
        {tfItems.map((item: TFItems) => {
          const label = transformCamelCase(item.name.toString());
          return (
            <TextField
              key={label}
              id={label}
              label={label}
              variant="outlined"
              name={item.name.toString()}
              value={formData[item.name]}
              onChange={handleFDataChange}
              error={item.isError}
              helperText={
                item.helperText || (item.isError && "Must be more than 2 chars")
              }
            />
          );
        })}
        <Button type="submit" variant="contained" disabled={disableSaveBtn}>
          Save Changes
        </Button>
      </Stack>
    </>
  );
}
