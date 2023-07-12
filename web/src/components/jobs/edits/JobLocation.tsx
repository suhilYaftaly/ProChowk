import { Alert, Stack, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

import { IJob, IJobError } from "./PostAJob";
import MapAreaSelector, { IMapAreaDetails } from "@appComps/MapAreaSelector";

interface Props {
  job: IJob;
  setJob: Dispatch<SetStateAction<IJob>>;
  errors: IJobError;
}

export default function JobLocation({ job, setJob, errors }: Props) {
  const onMapAreaChange = (location: IMapAreaDetails) =>
    setJob({ ...job, location: { ...job.location, ...location } });

  return (
    <Stack spacing={1}>
      <Typography>Select Target Location</Typography>
      <Typography variant="caption" color={"text.secondary"}>
        Note: Drag circle to change location!
      </Typography>
      <MapAreaSelector
        onMapAreaChange={onMapAreaChange}
        radius={job.location.radius}
      />

      {(Boolean(errors.radius) ||
        Boolean(errors.lat) ||
        Boolean(errors.lng)) && (
        <Alert severity="error" color="error">
          {errors.radius || errors.lat || errors.lng}
        </Alert>
      )}
    </Stack>
  );
}
