import {
  Box,
  Chip,
  Grid,
  ImageList,
  ImageListItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import { IJob } from "@gqlOps/jobs";
import { convertUnixToDate } from "@/utils/utilFuncs";

interface Props {
  job: IJob | undefined;
  loading: boolean;
}

export default function DetailsSection({ job, loading }: Props) {
  return (
    <Stack spacing={1}>
      {loading ? (
        <>
          <Skeleton variant="text" width={350} />
          <Skeleton variant="text" width={350} />
          <Skeleton variant="text" width={350} />
        </>
      ) : (
        <>
          <Typography variant="h5" color={"orange"}>
            UI Work In Progress 😎 !!
          </Typography>
          <Typography variant="h5">{job?.title}</Typography>
          <Typography>
            {job?.address?.city}, {job?.address?.stateCode}
            {" | "}
            {convertUnixToDate(job?.updatedAt)?.monthDayYear}
          </Typography>
          <Typography>
            {job?.budget.type}: ${job?.budget.from}-${job?.budget.to}
            {job?.budget.type === "Hourly" && ` / ${job?.budget.maxHours}Hrs`}
          </Typography>

          <div>
            <Grid container spacing={1} sx={{ my: 1 }}>
              {job?.skills?.map((skill) => (
                <Grid item key={skill.label}>
                  <Chip label={skill.label} variant="filled" size="small" />
                </Grid>
              ))}
            </Grid>
          </div>

          {job?.images && job?.images?.length > 0 && (
            <Box sx={{ maxHeight: 500, overflowY: "auto" }}>
              <ImageList variant="masonry" cols={3} gap={8}>
                {job.images.map((item) => (
                  <ImageListItem key={item.id}>
                    <img
                      src={`${item.picture}`}
                      srcSet={`${item.picture}`}
                      alt={item.name}
                      loading="lazy"
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>
          )}
          <Typography
            variant="body2"
            sx={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
          >
            {job?.desc}
          </Typography>
        </>
      )}
    </Stack>
  );
}
