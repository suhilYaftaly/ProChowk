import { ChangeEvent, useEffect, useState, FormEvent } from "react";
import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { SkillInput } from "@gqlOps/contractor";

interface IAdErr {
  title: string;
  desc: string;
}
export interface IAd extends IAdErr {
  id: string;
  type: "Service" | "Job";
  skills: SkillInput[];
}
interface Props {
  ad: IAd;
  setAd: (ad: IAd) => void;
  handleSave: (e: FormEvent<HTMLFormElement>) => void;
}

export default function AdForm({ ad, setAd, handleSave }: Props) {
  const [disableSaveBtn, setDisableSaveBtn] = useState(true);
  const [errors, setErrors] = useState<IAdErr>({ title: "", desc: "" });

  useEffect(() => {
    const hasErrors = Object.values(errors).some((error) => Boolean(error));
    setDisableSaveBtn(hasErrors);
  }, [errors, setDisableSaveBtn]);

  const handleAdChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setAd({ ...ad, [name]: value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(value, name as keyof IAd),
    }));
  };

  const validateField = (value: string, fieldName: keyof IAd) => {
    let error = "";

    switch (fieldName) {
      case "title":
      case "desc":
        if (value.length < 3) {
          error = `${fieldName} should have at least 3 characters`;
        }
        break;
      default:
        break;
    }

    return error;
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fieldNames: (keyof IAdErr)[] = Object.keys(ad) as (keyof IAdErr)[];
    const newErrors: Partial<IAdErr> = {};
    const hasErrors = Object.values(newErrors).some((error) => Boolean(error));
    const hasEmptyFields = Object.values(ad).some((v) => v.trim() === "");

    fieldNames.forEach((fieldName) => {
      const error = validateField(ad[fieldName], fieldName);
      if (error) newErrors[fieldName] = error;
    });

    setErrors((pr) => ({ ...pr, ...newErrors }));

    if (!hasErrors && !hasEmptyFields) handleSave(e);
  };

  return (
    <Stack
      component="form"
      sx={{ mt: 2 }}
      spacing={2}
      noValidate
      autoComplete="off"
      onSubmit={onSubmit}
    >
      <TextField
        label={"Title"}
        variant="outlined"
        size="small"
        name={"title"}
        value={ad.title}
        onChange={handleAdChange}
        placeholder={"ad title"}
        error={Boolean(errors.title)}
        helperText={errors.title}
        autoFocus
      />
      <TextField
        label={"Description"}
        variant="outlined"
        size="small"
        name={"desc"}
        value={ad.desc}
        onChange={handleAdChange}
        placeholder={"ad description"}
        error={Boolean(errors.desc)}
        helperText={errors.desc}
      />

      <Button type="submit" variant="contained" disabled={disableSaveBtn}>
        {false ? <CircularProgress size={20} /> : "Save Changes"}
      </Button>
      {/* {error && (
        <Alert severity="error" color="error">
          {error.message}
        </Alert>
      )} */}
    </Stack>
  );
}
