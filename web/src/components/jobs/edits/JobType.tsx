import { ChangeEvent, Dispatch, SetStateAction } from "react";
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

import { IJob, IJobError } from "./PostAJob";
import SkillsSelection from "@reusable/SkillsSelection";
import { SkillInput } from "@/graphql/operations/contractor";

interface Props {
  job: IJob;
  setJob: Dispatch<SetStateAction<IJob>>;
  errors: IJobError;
  setNewSkills: Dispatch<SetStateAction<SkillInput[]>>;
}

export default function JobType({ job, setJob, errors, setNewSkills }: Props) {
  const jobSizes: IJob["jobSize"][] = ["Small", "Medium", "Large"];
  const onValueChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setJob({ ...job, [name]: value });
  };

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value as IJob["jobSize"];
    setJob((pv) => ({ ...pv, jobSize: value }));
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
        autoFocus
      />
      <Divider />
      <Typography>Add skills required</Typography>
      <SkillsSelection
        skills={job.skills}
        setSkills={(skills) => setJob((pv) => ({ ...pv, skills }))}
        setNewSkills={setNewSkills}
      />
      {Boolean(errors.skills) && (
        <Alert severity="error" color="error">
          {errors.skills}
        </Alert>
      )}
    </Stack>
  );
}
