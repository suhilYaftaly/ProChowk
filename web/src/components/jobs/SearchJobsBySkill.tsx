import {
  Autocomplete,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState, FormEvent } from "react";

import ErrSnackbar from "@reusable/ErrSnackbar";
import { SkillInput, useSkills } from "@gqlOps/skill";
import { useJobsBySkill } from "@gqlOps/job";
import { useUserStates } from "@redux/reduxStates";
import { JobsCards } from "./Jobs";

interface Props {}

export default function SearchJobsBySkill({}: Props) {
  const [openErrBar, setOpenErrBar] = useState(false);
  const {
    skillsAsync,
    data: allSkillsType,
    loading: allSkillsLoading,
    error: allSkillsError,
  } = useSkills();
  const allSkillsData = allSkillsType?.skills;
  const [selectedSkill, setSelectedSkill] = useState("");
  const {
    jobsBySkillAsync,
    data: jobsData,
    loading: jobsLoading,
  } = useJobsBySkill();
  const { userLocation } = useUserStates();

  const onSkillSelection = (_: any, value: SkillInput | null | string) => {
    if (value && typeof value === "string") setSelectedSkill(value);
    else if (value && typeof value !== "string") setSelectedSkill(value.label);
  };

  const onSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userLocation.data && selectedSkill) {
      jobsBySkillAsync({
        variables: { skill: selectedSkill, latLng: userLocation.data },
      });
    }
  };

  return (
    <Stack spacing={1}>
      <Typography>UI WIP...😉</Typography>
      <Stack
        direction={"row"}
        component="form"
        autoComplete="off"
        onSubmit={onSearch}
      >
        <Autocomplete
          onOpen={() => skillsAsync({})}
          loading={allSkillsLoading}
          disablePortal
          options={allSkillsData || []}
          onChange={onSkillSelection}
          size="small"
          sx={{ width: "100%", mr: 2 }}
          renderInput={(params) => (
            <TextField {...params} label="Search nearby jobs" />
          )}
        />
        <Button variant="outlined" type="submit">
          Search
        </Button>
      </Stack>
      <div>
        <JobsCards jobs={jobsData?.jobsBySkill} loading={jobsLoading} />
      </div>
      <ErrSnackbar
        open={openErrBar}
        handleClose={setOpenErrBar}
        errMsg={allSkillsError?.message}
      />
    </Stack>
  );
}
