import { ChangeEvent, useEffect, useState, FormEvent, useRef } from "react";
import { Button, CircularProgress, Stack, TextField } from "@mui/material";

export interface Job {
  id: string;
  title: string;
  desc: string;
}
interface Props {
  job: Job;
  setJob: (job: Job) => void;
  handleSave: (e: FormEvent<HTMLFormElement>) => void;
}

export default function UserJobForm({ job, setJob, handleSave }: Props) {
  const titleFieldRef = useRef<HTMLInputElement>(null);
  const [disableSaveBtn, setDisableSaveBtn] = useState(true);
  const [errors, setErrors] = useState<Job>({ id: "", title: "", desc: "" });

  useEffect(() => {
    const hasErrors = Object.values(errors).some((error) => Boolean(error));
    setDisableSaveBtn(hasErrors);
  }, [errors, setDisableSaveBtn]);

  useEffect(() => {
    titleFieldRef.current && titleFieldRef.current.focus();
  }, []);

  const handleJobChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setJob({ ...job, [name]: value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(value, name as keyof Job),
    }));
  };

  const validateField = (value: string, fieldName: keyof Job) => {
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

    const fieldNames: (keyof Job)[] = Object.keys(job) as (keyof Job)[];
    const newErrors: Partial<Job> = {};
    const hasErrors = Object.values(newErrors).some((error) => Boolean(error));
    const hasEmptyFields = Object.values(job).some((v) => v.trim() === "");

    fieldNames.forEach((fieldName) => {
      const error = validateField(job[fieldName], fieldName);
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
        value={job.title}
        onChange={handleJobChange}
        placeholder={"job title"}
        error={Boolean(errors.title)}
        helperText={errors.title}
        inputRef={titleFieldRef}
      />
      <TextField
        label={"Description"}
        variant="outlined"
        size="small"
        name={"desc"}
        value={job.desc}
        onChange={handleJobChange}
        placeholder={"job description"}
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
