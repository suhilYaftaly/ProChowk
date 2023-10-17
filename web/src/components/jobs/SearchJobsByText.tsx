import {
  Autocomplete,
  Button,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import { useState, FormEvent, useEffect } from "react";

import ErrSnackbar from "@reusable/ErrSnackbar";
import { useSkills } from "@gqlOps/skill";
import { useJobsByLocation, useJobsByText } from "@gqlOps/job";
import { useUserStates } from "@redux/reduxStates";
import { JobsCards } from "./Jobs";

interface Props {}

export default function SearchJobsByText({}: Props) {
  const theme = useTheme();
  const [openErrBar, setOpenErrBar] = useState(false);
  const {
    skillsAsync,
    data: allSkillsType,
    loading: allSkillsLoading,
    error: allSkillsError,
  } = useSkills();
  const allSkillsData = allSkillsType?.skills;
  const [searchText, setSearchText] = useState("");
  const { jobsByTextAsync, loading: jByTextLoading } = useJobsByText();
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

  const onTextChange = (_: any, value: string | null) => {
    if (value) setSearchText(value);
  };
  const onInputChange = (_: any, value: string, __: string) => {
    setSearchText(value);
  };

  const onSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userLocation.data && searchText) {
      jobsByTextAsync({
        variables: { inputText: searchText, latLng: userLocation.data },
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
          options={allSkillsData?.map((skill) => skill.label) || []}
          freeSolo
          onChange={onTextChange}
          onInputChange={onInputChange}
          size="small"
          sx={{
            width: "100%",
            mr: 2,
            backgroundColor: theme.palette.background.paper,
          }}
          renderInput={(params) => (
            <TextField {...params} label="Search nearby jobs" />
          )}
        />
        <Button
          variant="outlined"
          type="submit"
          sx={{ backgroundColor: theme.palette.background.paper }}
        >
          Search
        </Button>
      </Stack>
      <div>
        <JobsCards
          jobs={jobsData?.jobsByLocation}
          loading={jByLLoading}
          updateLoading={jByTextLoading || jByLLoading}
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
