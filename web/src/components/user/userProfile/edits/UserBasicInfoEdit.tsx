import {
  Alert,
  Button,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { formatPhoneNum, validatePhoneNum } from "@utils/utilFuncs";
import { useAppDispatch } from "@utils/hooks/hooks";
import { setUserProfile } from "@rSlices/userSlice";
import { IUserInfo } from "../UserInfo";
import UserAddressEdit from "./UserAddressEdit";
import userOps, { IUpdateUserData, IUpdateUserInput } from "@gqlOps/user";
import { useMutation } from "@apollo/client";

interface Props extends IUserInfo {
  closeEdit: () => void;
}

export default function UserBasicInfoEdit({ user, closeEdit }: Props) {
  const dispatch = useAppDispatch();
  const [disableSaveBtn, setDisableSaveBtn] = useState(true);
  const [addressData, setAddressData] = useState({ ...user?.address });
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phoneNum: user?.phoneNum,
    bio: user?.bio,
  });
  const [formError, setFormError] = useState({
    name: false,
    phoneNum: false,
    bio: false,
  });
  const [updateUser, { loading: updateLoading, error }] = useMutation<
    IUpdateUserData,
    IUpdateUserInput
  >(userOps.Mutations.updateUser);

  useEffect(() => {
    setFormData((prevValues) => ({
      ...prevValues,
      name: user?.name || "",
      phoneNum: user?.phoneNum,
      bio: user?.bio,
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

    const isPhoneValid = validatePhoneNum(formData.phoneNum);

    if (formData.name?.length < 3) {
      setFormError((pv) => ({ ...pv, name: true }));
      errorExists = true;
    }
    if (formData.phoneNum && !isPhoneValid) {
      setFormError((pv) => ({ ...pv, phoneNum: true }));
      errorExists = true;
    }
    if (formData.bio && formData.bio?.length < 10) {
      setFormError((pv) => ({ ...pv, bio: true }));
      errorExists = true;
    }

    return errorExists;
  };

  const updateUserData = async (newData: any) => {
    try {
      const { data } = await updateUser({
        variables: {
          id: user.id,
          name: newData.name,
          phoneNum: newData.phoneNum,
          address: newData.address,
          bio: newData.bio,
        },
      });
      if (data?.updateUser) {
        dispatch(setUserProfile(data?.updateUser));
        closeEdit();
      } else throw new Error();
    } catch (error: any) {
      console.log("user update failed:", error.message);
    }
  };

  const handleSave = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (validateFEntries()) return;
    setDisableSaveBtn(true);

    if (formData.name) {
      const newData = {
        name: formData.name,
        phoneNum: formData.phoneNum,
        address: addressData,
        bio: formData.bio,
      };
      delete (newData.address as any).__typename;
      updateUserData(newData);
    }
  };

  return (
    <Stack
      component="form"
      sx={{ mt: 2 }}
      spacing={2}
      noValidate
      autoComplete="off"
      onSubmit={handleSave}
    >
      <Typography fontWeight={"600"}>Basic Info</Typography>
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
        required
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
      <TextField
        label={"Biography"}
        variant="outlined"
        size="small"
        name={"bio"}
        value={formData.bio}
        onChange={handleFDataChange}
        error={formError.bio}
        helperText={formError.bio && "Must be more than 10 chars"}
        placeholder={"your biography"}
      />
      <div>
        <Divider sx={{ my: 2 }} />
        <Typography sx={{ fontWeight: "600" }}>Address</Typography>
      </div>
      <UserAddressEdit
        user={user}
        addressData={addressData}
        setAddressData={setAddressData}
        setDisableSaveBtn={setDisableSaveBtn}
      />
      <Button type="submit" variant="contained" disabled={disableSaveBtn}>
        {updateLoading ? <CircularProgress size={20} /> : "Save Changes"}
      </Button>
      {error && (
        <Alert severity="error" color="error">
          {error.message}
        </Alert>
      )}
    </Stack>
  );
}
