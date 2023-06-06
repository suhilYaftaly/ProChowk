import {
  Avatar,
  Button,
  ButtonBase,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { useUserStates } from "../../../redux/reduxStates";
import {
  convertUnixToDate,
  processImageFile,
  transformCamelCase,
  validateEmail,
} from "../../../utils/utilFuncs";
import { useAppDispatch, useRespVal } from "../../../utils/hooks/hooks";
import { setUserProfile } from "../../../redux/slices/userSlice";

export default function MyInfo() {
  const dispatch = useAppDispatch();
  const { user } = useUserStates();
  const [disableSaveBtn, setDisableSaveBtn] = useState(true);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    image: user?.picture,
  });
  const isEmailInvalid = !validateEmail(formData.email);

  const tfItems = [
    { name: "name", error: formData.name.length < 3 },
    {
      name: "email",
      error: isEmailInvalid,
      helperText: isEmailInvalid ? "Invalid email format" : "",
    },
  ];

  useEffect(() => {
    if (user) {
      setFormData((prevValues) => ({
        ...prevValues,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        image: user.image,
      }));
    }
  }, []);

  //disable button if any form error exists
  useEffect(() => {
    const hasErrors = tfItems.some((item) => item.error);
    if (hasErrors) setDisableSaveBtn(hasErrors);
  }, [formData, tfItems]);

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
    if (formData.name && formData.email) {
      const updatedUser = {
        ...(user as any),
        name: formData.name,
        email: formData.email,
        image: formData.image,
      };
      dispatch(setUserProfile(updatedUser));
      setDisableSaveBtn(true);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      processImageFile(file, (imageUrl) => {
        setFormData((pv) => ({
          ...pv,
          image: {
            picture: imageUrl,
            name: file.name,
            size: file.size,
            type: file.type,
          },
        }));
        setDisableSaveBtn(false);
      });
    }
  };

  return (
    <>
      <Stack
        direction={useRespVal("column", "row")}
        sx={{ alignItems: "center" }}
        spacing={2}
      >
        <ButtonBase component="label" htmlFor="avatar-upload">
          <Avatar
            alt={user?.name}
            src={formData.image?.picture}
            sx={{ width: 100, height: 100 }}
          />
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </ButtonBase>
        <Stack sx={{ textAlign: useRespVal("center", "left") }}>
          <Typography>{user?.name}</Typography>
          <Typography>
            Joined {convertUnixToDate(user?.createdAt)?.monthDayYear}
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
        {tfItems.map((item) => {
          const label = transformCamelCase(item.name.toString());
          return (
            <TextField
              key={label}
              id={label}
              label={label}
              variant="outlined"
              name={item.name.toString()}
              value={formData[item.name as keyof typeof formData]}
              onChange={handleFDataChange}
              error={item.error}
              helperText={
                item.helperText || (item.error && "Must be more than 2 chars")
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
