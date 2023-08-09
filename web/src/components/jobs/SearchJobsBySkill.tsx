import { Autocomplete, Button, Stack, TextField } from "@mui/material";
import { useState, FormEvent, useEffect } from "react";

import ErrSnackbar from "@reusable/ErrSnackbar";
import { SkillInput, useSkills } from "@gqlOps/skill";
import { useJobsByLocation, useJobsBySkill } from "@gqlOps/job";
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
  const { jobsBySkillAsync, loading: jBySLoading } = useJobsBySkill();
  const {
    jobsByLocationAsync,
    data: jobsData,
    loading: jByLLoading,
  } = useJobsByLocation();
  const { userLocation } = useUserStates();

  useEffect(() => {
    if (userLocation.data)
      jobsByLocationAsync({ variables: { latLng: userLocation.data } });
  }, [userLocation.data]);

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
        <JobsCards
          jobs={jobsData?.jobsByLocation}
          loading={jByLLoading}
          updateLoading={jBySLoading || jByLLoading}
        />
      </div>
      <ErrSnackbar
        open={openErrBar}
        handleClose={setOpenErrBar}
        errMsg={allSkillsError?.message}
      />
    </Stack>
  );
}
