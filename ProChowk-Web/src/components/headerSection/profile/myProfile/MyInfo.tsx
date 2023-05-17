import { Avatar, Button, Stack, TextField, Typography } from "@mui/material";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { useUserStates } from "../../../../redux/reduxStates";
import { convertUnixToDate } from "../../../../utils/utilFuncs";
import { useAppDispatch, useGetSSV } from "../../../../utils/hooks";
import { setUserProfile } from "../../../../redux/slices/userSlice";

export default function MyInfo() {
  const dispatch = useAppDispatch();
  const { user } = useUserStates();
  const [formData, setFormData] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
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
    }
  };

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
        <TextField
          id="first name"
          label="First Name"
          variant="outlined"
          name="firstName"
          value={formData.firstName}
          onChange={handleFDataChange}
        />
        <TextField
          id="last name"
          label="Last Name"
          variant="outlined"
          name="lastName"
          value={formData.lastName}
          onChange={handleFDataChange}
        />
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          name="email"
          value={formData.email}
          onChange={handleFDataChange}
        />
        <Button type="submit" variant="contained">
          Save
        </Button>
      </Stack>
    </>
  );
}
