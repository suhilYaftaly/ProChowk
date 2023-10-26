import { ChangeEvent } from "react";
import {
  Alert,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SkillsSelection from "@appComps/SkillsSelection";
import { IJobError } from "./JobForm";
import { JobInput } from "@gqlOps/job";
import { ISkill } from "@gqlOps/skill";

interface Props {
  job: JobInput;
  setJob: (job: JobInput) => void;
  errors: IJobError;
  setAllSkills?: (skills: ISkill[]) => void;
}

export default function JobType({ job, setJob, errors, setAllSkills }: Props) {
  const jobSizes: JobInput["jobSize"][] = ["Small", "Medium", "Large"];
  const onValueChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setJob({ ...job, [name]: value });
  };

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value as JobInput["jobSize"];
    setJob({ ...job, jobSize: value });
  };

  return (
    <Stack
      component="form"
      sx={{ mt: 2 }}
      spacing={2}
      noValidate
      autoComplete="off"
    >
      <FormControl fullWidth>
        <InputLabel id="job-size-select">Job Size</InputLabel>
        <Select
          labelId="job-size-select"
          value={job.jobSize}
          label="Job Size"
          onChange={handleChange}
          size="small"
        >
          {jobSizes?.map((size) => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label={"Title"}
        variant="outlined"
        size="small"
        name={"title"}
        value={job.title}
        onChange={onValueChange}
        placeholder={"I need my washroom to be tiled"}
        error={Boolean(errors.title)}
        helperText={errors.title}
        required
      />
      <Divider />
      <Typography>Add skills</Typography>
      <SkillsSelection
        skills={job.skills}
        setSkills={(skills) => setJob({ ...job, skills })}
        setAllSkills={setAllSkills}
        required
      />
      {Boolean(errors.skills) && (
        <Alert severity="error" color="error">
          {errors.skills}
        </Alert>
      )}
    </Stack>
  );
}
