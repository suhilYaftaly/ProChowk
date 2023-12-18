import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";

import { IUpdateUserInput, IUser, useUpdateUser } from "@gqlOps/user";
import { clientBioPlaceholder, contractorBioPlaceholder } from "@/config/data";
import { isClient } from "@/utils/auth";
import { charsCount } from "@/utils/utilFuncs";

interface Props {
  onClose: () => void;
  user: IUser;
}
export default function UserAboutEdit({ user, onClose }: Props) {
  const { updateUserAsync, loading: updLoading } = useUpdateUser();
  const [disableSaveBtn, setDisableSaveBtn] = useState(true);
  const [form, setForm] = useState({ bio: user?.bio });
  const [errors, setErrors] = useState<IFormErrs>({ bio: "" });

  const handleFDataChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    let { name, value } = e.target;

    setDisableSaveBtn(false);
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm({ form, setErrors })) return;
    setDisableSaveBtn(true);

    if (user) {
      const updateData = { id: user.id, edits: form };

      updateUserAsync({
        variables: updateData,
        onSuccess: () => {
          toast.success("Profile updated successfully!", {
            position: "bottom-right",
          });
          onClose();
        },
      });
    }
  };

  return (
    <Stack component={"form"} onSubmit={handleSaveChanges} spacing={4}>
      <TextField
        label={`A Bit About You ${charsCount(form.bio, 1000)}`}
        variant="outlined"
        size="small"
        value={form.bio}
        name={"bio"}
        onChange={handleFDataChange}
        error={Boolean(errors.bio)}
        helperText={errors.bio}
        placeholder={
          isClient(user.userTypes)
            ? clientBioPlaceholder
            : contractorBioPlaceholder
        }
        multiline={true}
        rows={6}
        inputProps={{ maxLength: 1000 }}
      />
      <Button variant="contained" disabled={disableSaveBtn} type="submit">
        {updLoading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          "Save Changes"
        )}
      </Button>
    </Stack>
  );
}

interface IFormErrs {
  bio: string;
}
interface IValidateProps {
  form: IUpdateUserInput;
  setErrors: Dispatch<SetStateAction<IFormErrs>>;
}
/**sets the errors and returns hasErrors @returns hasErrors as boolean */
const validateForm = ({ form, setErrors }: IValidateProps) => {
  let hasError = false;
  let formErrs: IFormErrs = { bio: "" };

  if (form?.bio && form.bio?.length < 2) {
    formErrs.bio = "About you must be more than 5 characters";
    hasError = true;
  }

  setErrors(formErrs);
  return hasError;
};
