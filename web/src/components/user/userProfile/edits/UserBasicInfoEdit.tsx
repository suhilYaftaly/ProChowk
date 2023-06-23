import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@apollo/client";

import { formatPhoneNum, validatePhoneNum } from "@utils/utilFuncs";
import { useAppDispatch } from "@utils/hooks/hooks";
import { setUserProfile } from "@rSlices/userSlice";
import UserAddressEdit from "./UserAddressEdit";
import userOps, { IUpdateUserData, IUpdateUserInput } from "@gqlOps/user";
import { IUserInfo } from "../UserInfo";

interface Props extends IUserInfo {
  closeEdit: () => void;
}

interface FormError {
  name: boolean;
  phoneNum: boolean;
  bio: boolean;
}

const UserBasicInfoEdit: React.FC<Props> = ({ user, closeEdit }) => {
  const dispatch = useAppDispatch();
  const [disableSaveBtn, setDisableSaveBtn] = useState(true);
  const [addressData, setAddressData] = useState({ ...user?.address });
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phoneNum: user?.phoneNum,
    bio: user?.bio,
  });
  const [formError, setFormError] = useState<FormError>({
    name: false,
    phoneNum: false,
    bio: false,
  });
  const [updateUser, { loading: updateLoading, error }] = useMutation<
    IUpdateUserData,
    IUpdateUserInput
  >(userOps.Mutations.updateUser);

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      phoneNum: user?.phoneNum,
      bio: user?.bio,
    });
  }, [user]);

  const validateField = useCallback(
    (value: string | undefined, fieldName: keyof FormError): boolean => {
      if (fieldName === "name" && value && value.length < 3) {
        return true;
      }
      if (fieldName === "phoneNum" && value && !validatePhoneNum(value)) {
        return true;
      }
      if (fieldName === "bio" && value && value.length < 10) {
        return true;
      }
      return false;
    },
    []
  );

  const handleFDataChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;
      setDisableSaveBtn(false);
      setFormData((prevData) => ({
        ...prevData,
        [name]: name === "phoneNum" ? formatPhoneNum(value) : value,
      }));
      setFormError((prevErrors) => ({
        ...prevErrors,
        [name]: validateField(value, name as keyof FormError),
      }));
    },
    [validateField]
  );

  const validateForm = useCallback(() => {
    const errors: FormError = {
      name: validateField(formData.name, "name"),
      phoneNum: validateField(formData.phoneNum, "phoneNum"),
      bio: validateField(formData.bio, "bio"),
    };

    setFormError(errors);

    return Object.values(errors).some((error) => error);
  }, [formData, validateField]);

  const updateUserData = async (newData: any) => {
    if (user) {
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
        } else {
          throw new Error();
        }
      } catch (error: any) {
        console.log("user update failed:", error.message);
      }
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (validateForm()) return;
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
        label={"Biography (max 450 chars)"}
        variant="outlined"
        size="small"
        name={"bio"}
        value={formData.bio}
        onChange={handleFDataChange}
        error={formError.bio}
        helperText={formError.bio && "Must be more than 10 chars"}
        placeholder={"your biography"}
        multiline={true}
        rows={3}
        inputProps={{ maxLength: 450 }}
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
};

export default UserBasicInfoEdit;
