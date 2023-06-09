import {
  Avatar,
  Button,
  ButtonBase,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { useUserStates } from "@redux/reduxStates";
import {
  convertUnixToDate,
  formatPhoneNum,
  processImageFile,
  validateEmail,
  validatePhoneNum,
} from "@utils/utilFuncs";
import { useAppDispatch, useRespVal } from "@utils/hooks/hooks";
import { setUserProfile } from "@rSlices/userSlice";

export default function MyBasicInfo() {
  const dispatch = useAppDispatch();
  const { user } = useUserStates();
  const [disableSaveBtn, setDisableSaveBtn] = useState(true);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    image: user?.image,
    phoneNum: user?.phoneNum,
  });
  const [formError, setFormError] = useState({
    name: false,
    email: false,
    phoneNum: false,
    image: false,
  });

  useEffect(() => {
    setFormData((prevValues) => ({
      ...prevValues,
      name: user?.name || "",
      email: user?.email || "",
      phoneNum: user?.phoneNum,
      image: user?.image,
    }));
  }, [user]);

  const handleFDataChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setDisableSaveBtn(false);
    setFormError((pv) => ({ ...pv, [name]: false }));

    const fValue = name === "phoneNum" ? formatPhoneNum(value) : value;

    setFormData((pv) => ({ ...pv, [name]: fValue }));
  };

  const validateFEntries = () => {
    let errorExists = false;

    const isPhoneValid =
      formData.phoneNum === undefined || formData.phoneNum === ""
        ? true
        : validatePhoneNum(formData.phoneNum);

    if (formData.name?.length < 3) {
      setFormError((pv) => ({ ...pv, name: true }));
      errorExists = true;
    }
    if (!validateEmail(formData.email)) {
      setFormError((pv) => ({ ...pv, email: true }));
      errorExists = true;
    }
    if (!isPhoneValid) {
      setFormError((pv) => ({ ...pv, phoneNum: true }));
      errorExists = true;
    }

    return errorExists;
  };

  const handleSave = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (validateFEntries()) return;

    if (formData.name && formData.email) {
      const updatedUser = {
        ...(user as any),
        name: formData.name,
        email: formData.email,
        phoneNum: formData.phoneNum,
        image: formData.image,
      };
      dispatch(setUserProfile(updatedUser));
    }
    setDisableSaveBtn(true);
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
        <TextField
          label={"Name"}
          variant="outlined"
          size="small"
          name={"name"}
          value={formData.name}
          onChange={handleFDataChange}
          error={formError.name}
          helperText={formError.name && "Must be more than 2 chars"}
          placeholder={"your name"}
        />
        <TextField
          label={"Email"}
          variant="outlined"
          size="small"
          name={"email"}
          value={formData.email}
          type="email"
          onChange={handleFDataChange}
          error={formError.email}
          helperText={formError.email && "Invalid email format"}
          placeholder="yours@example.com"
        />
        <TextField
          label={"Phone Number"}
          variant="outlined"
          size="small"
          name={"phoneNum"}
          value={formData.phoneNum}
          onChange={handleFDataChange}
          error={formError.phoneNum}
          helperText={formError.phoneNum && "Invalid phone number format"}
          placeholder="e.g. 999-999-9999"
        />
        <Button type="submit" variant="contained" disabled={disableSaveBtn}>
          Save Changes
        </Button>
      </Stack>
    </>
  );
}
