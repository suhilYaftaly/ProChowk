import {
  Stack,
  Typography,
  IconButton,
  Card,
  Chip,
  Grid,
  Skeleton,
  useTheme,
  Divider,
  alpha,
} from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import { IJob } from "@gqlOps/job";
import {
  formatRelativeTime,
  openGoogleMapsDirections,
  trimText,
} from "@utils/utilFuncs";
import { paths } from "@/routes/Routes";
import ChipSkeleton from "@reusable/skeleton/ChipSkeleton";
import Text from "@reusable/Text";
import JobBudgetCost from "../comps/JobBudgetCost";

interface Props {
  jobs: IJob[] | undefined;
  loading?: boolean;
}
export default function JobsCards({ jobs, loading = false }: Props) {
  const navigate = useNavigate();
  const theme = useTheme();
  const primaryC = theme.palette.primary.main;
  const primary10 = alpha(primaryC, 0.1);

  return (
    <Grid container spacing={1} direction={"column"}>
      {loading ? (
        <Grid item>
          <CardSkeleton />
        </Grid>
      ) : (
        <>
          {jobs?.map((job) => (
            <Grid item key={job.id}>
              <Card
                variant={"outlined"}
                sx={{
                  p: 1,
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": {
                    backgroundColor: primary10,
                    borderColor: primaryC,
                  },
                }}
                onClick={() =>
                  job.userId && navigate(paths.jobView(job.userId, job.id))
                }
              >
                <Stack
                  direction={"row"}
                  sx={{
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Text type="subtitle">{job.title}</Text>
                  <Chip
                    variant="outlined"
                    size="small"
                    label={formatRelativeTime(job.createdAt)}
                    icon={<AccessTimeIcon color="inherit" />}
                  />
                </Stack>
                <JobBudgetCost budget={job?.budget} />
                <Typography variant="body2">
                  {trimText({ text: job.desc })}
                </Typography>
                <Grid container spacing={1} sx={{ mt: 2, mb: 2 }}>
                  {job?.skills?.map((skill) => (
                    <Grid item key={skill.label}>
                      <Chip
                        label={skill.label}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                  ))}
                </Grid>
                <Divider sx={{ my: 1 }} />
                <Stack direction={"row"} sx={{ alignItems: "center" }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      openGoogleMapsDirections({
                        lat: job?.address?.lat,
                        lng: job?.address?.lng,
                      });
                    }}
                  >
                    <LocationOn
                      sx={{
                        border: "2px solid",
                        padding: 0.4,
                        borderRadius: 5,
                        color: theme.palette.text.light,
                      }}
                    />
                  </IconButton>
                  <Text type="subtitle">{job?.address?.city}</Text>
                </Stack>
              </Card>
            </Grid>
          ))}
        </>
      )}
    </Grid>
  );
}

const CardSkeleton = () => (
  <Card sx={{ p: 1 }} variant="outlined">
    <Stack
      direction={"row"}
      sx={{ alignItems: "center", justifyContent: "space-between" }}
    >
      <Skeleton variant="text" width="60%" />
      <ChipSkeleton />
    </Stack>
    <Skeleton variant="text" width="30%" />
    <Skeleton variant="text" width="60%" sx={{ mb: 3 }} />
    <Stack direction={"row"} spacing={1}>
      <ChipSkeleton />
      <ChipSkeleton />
      <ChipSkeleton />
    </Stack>
    <Skeleton variant="rectangular" width={"100%"} height={1} sx={{ my: 2 }} />
    <Stack direction={"row"} spacing={1} alignItems={"center"}>
      <Skeleton variant="circular" width={30} height={30} />
      <Skeleton variant="text" width={60} />
    </Stack>
  </Card>
);
