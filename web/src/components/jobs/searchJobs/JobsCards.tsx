import {
  Stack,
  IconButton,
  Card,
  Chip,
  Grid,
  Skeleton,
  useTheme,
  Divider,
  alpha,
} from "@mui/material";
import { LocationOn, Delete, AccessTime } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

import { IJob, useDeleteJob } from "@gqlOps/job";
import {
  formatRelativeTime,
  openGoogleMapsDirections,
  trimText,
} from "@utils/utilFuncs";
import { paths } from "@/routes/Routes";
import ChipSkeleton from "@reusable/skeleton/ChipSkeleton";
import Text from "@reusable/Text";
import JobBudgetCost from "../comps/JobBudgetCost";
import { iconCircleSX } from "@/styles/sxStyles";
import DeleteModal from "@reusable/DeleteModal";

interface Props {
  jobs: IJob[] | undefined;
  loading?: boolean;
  onJobClick?: (job: IJob) => void;
  topRightComp?: React.ReactNode;
  allowDelete?: boolean;
  showDraftExpiry?: boolean;
}
export default function JobsCards({
  jobs,
  loading = false,
  onJobClick,
  topRightComp,
  allowDelete,
  showDraftExpiry,
}: Props) {
  const navigate = useNavigate();

  const handleJobClick = (job: IJob) => {
    if (onJobClick) onJobClick(job);
    else job.userId && navigate(paths.jobView(job.id));
  };

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
              <JobCard
                job={job}
                onClick={() => handleJobClick(job)}
                allowDelete={allowDelete}
                showDraftExpiry={showDraftExpiry}
                topRightComp={topRightComp}
              />
            </Grid>
          ))}
        </>
      )}
    </Grid>
  );
}

interface IJobCard {
  job: IJob;
  onClick: () => void;
  topRightComp?: React.ReactNode;
  allowDelete?: boolean;
  showDraftExpiry?: boolean;
}
const JobCard = ({
  job,
  onClick,
  topRightComp,
  allowDelete,
  showDraftExpiry,
}: IJobCard) => {
  const theme = useTheme();
  const primaryC = theme.palette.primary.main;
  const primary10 = alpha(primaryC, 0.1);
  const error10 = alpha(theme.palette.error.light, 0.1);

  return (
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
      onClick={onClick}
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
        <Stack direction={"row"} alignItems={"center"}>
          <Chip
            variant="outlined"
            size="small"
            label={formatRelativeTime(job.createdAt)}
            icon={<AccessTime color="inherit" />}
            sx={{ ml: 1 }}
          />
          {showDraftExpiry && job.isDraft && job.draftExpiry && (
            <Chip
              variant="outlined"
              size="small"
              color="error"
              label={`Expires in ${formatRelativeTime(
                job.draftExpiry,
                "until"
              )}`}
              icon={<AccessTime color="inherit" />}
              sx={{ ml: 1, backgroundColor: error10 }}
            />
          )}
          {topRightComp}
          {allowDelete && job.userId && (
            <DeleteJobIcon jobId={job.id} userId={job.userId} />
          )}
        </Stack>
      </Stack>
      <JobBudgetCost budget={job?.budget} />
      <Text variant="body2">{trimText({ text: job.desc })}</Text>
      <Grid container spacing={1} sx={{ mt: 1, mb: 2 }}>
        {job?.skills?.map((skill) => (
          <Grid item key={skill.label}>
            <Chip label={skill.label} variant="outlined" size="small" />
          </Grid>
        ))}
      </Grid>
      <Divider sx={{ my: 1 }} />
      <Stack direction={"row"} sx={{ alignItems: "center" }}>
        {job?.address?.city && (
          <>
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
          </>
        )}
      </Stack>
    </Card>
  );
};

interface IDeleteJobProps {
  jobId: string;
  userId: string;
}
export const DeleteJobIcon = ({ jobId, userId }: IDeleteJobProps) => {
  const theme = useTheme();
  const { deleteJobAsync, loading } = useDeleteJob();
  const [openDelete, setOpenDelete] = useState(false);

  const deleteJob = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    deleteJobAsync({
      userId,
      variables: { id: jobId },
      onSuccess: () => {
        toast.success("Job deleted successfully.", {
          position: "bottom-right",
        });
        setOpenDelete(false);
      },
    });
  };

  const confirmDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setOpenDelete(true);
  };

  return (
    <>
      <IconButton size="small" sx={{ ml: 1 }} onClick={confirmDelete}>
        <Delete sx={{ ...iconCircleSX(theme), width: 25, height: 25 }} />
      </IconButton>
      <DeleteModal
        open={openDelete}
        onClose={setOpenDelete}
        onDelete={deleteJob}
        loading={loading}
      />
    </>
  );
};

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
      <Skeleton variant="circular" width={25} height={25} />
      <Skeleton variant="text" width={60} />
    </Stack>
  </Card>
);
