import { useState, useEffect, MouseEvent } from "react";
import {
  Stack,
  Typography,
  IconButton,
  Card,
  Chip,
  Grid,
  Skeleton,
  Popover,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  useTheme,
  Divider,
  alpha,
} from "@mui/material";
import { Add, Edit, Delete, MoreVert, LocationOn } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import { IUserInfo } from "@user/userProfile/UserInfo";
import CustomModal from "@reusable/CustomModal";
import JobForm from "./edits/JobForm";
import {
  IJob,
  ImagesToDelete,
  JobInput,
  useCreateJob,
  useDeleteJob,
  useUserJobs,
  useUpdateJob,
} from "@gqlOps/job";
import ErrSnackbar from "@reusable/ErrSnackbar";
import {
  formatRelativeTime,
  removeServerMetadata,
  trimText,
} from "@utils/utilFuncs";
import { paths } from "@/routes/Routes";
import { ISkill, useSkills } from "@gqlOps/skill";
import { getNewSkills } from "@appComps/SkillsSelection";
import { useUserStates } from "@redux/reduxStates";
import Text from "../reusable/Text";
import { setOpenJobPost } from "@rSlices/globalModalsSlice";
import { useAppDispatch } from "@hooks/hooks";

export default function Jobs({ isMyProfile, userId }: IUserInfo) {
  const dispatch = useAppDispatch();
  const { userJobsAsync, data, loading, error } = useUserJobs();
  const { loading: createLoading } = useCreateJob();
  const { updateJobAsync, loading: updateLoading } = useUpdateJob();
  const { deleteJobAsync, loading: deleteLoading } = useDeleteJob();
  const { updateCache } = useSkills();
  const [editJob, setEditJob] = useState<JobInput | IJob>();
  const [openEdit, setOpenEdit] = useState(false);
  const [openErrBar, setContErrBar] = useState(false);
  const [allSkills, setAllSkills] = useState<ISkill[]>([]);
  const { userLocation } = useUserStates();

  useEffect(() => {
    if (userId) userJobsAsync({ variables: { userId } });
  }, []);

  const onEditJob = (j: IJob | any, imagesToDelete: ImagesToDelete) => {
    if (userId && j.id) {
      const cleanedJob = removeServerMetadata({ obj: j });
      updateJobAsync({
        userId,
        variables: {
          id: j.id,
          imagesToDelete,
          jobInput: {
            title: cleanedJob.title,
            desc: cleanedJob.desc,
            jobSize: cleanedJob.jobSize,
            budget: cleanedJob.budget,
            skills: cleanedJob.skills,
            images: cleanedJob.images,
            address: cleanedJob.address,
          },
        },
        onSuccess: (dt) => {
          const newSkills = getNewSkills({
            newList: dt.skills,
            oldList: allSkills,
          });
          if (newSkills && newSkills?.length > 0)
            updateCache("create", newSkills);
        },
      });
      setOpenEdit(false);
    }
  };

  const onDeleteClick = (j: IJob | any) => {
    if (userId && j.id && userLocation.data)
      deleteJobAsync({
        userId,
        variables: { id: j.id },
        latLng: userLocation.data,
      });
  };
  const onEditClick = (job: IJob) => {
    setEditJob(job);
    setOpenEdit(true);
  };

  return (
    <>
      <Stack
        direction={"row"}
        sx={{ alignItems: "center", justifyContent: "space-between", mb: 2 }}
      >
        <Typography variant="h5">Jobs</Typography>
        {isMyProfile && (
          <IconButton onClick={() => dispatch(setOpenJobPost(true))}>
            <Add />
          </IconButton>
        )}
      </Stack>
      <JobsCards
        jobs={data?.userJobs}
        loading={loading}
        isMyProfile={isMyProfile}
        onDeleteClick={onDeleteClick}
        onEditClick={onEditClick}
        updateLoading={updateLoading || createLoading || deleteLoading}
      />
      {editJob && (
        <CustomModal title="Edit Job" open={openEdit} onClose={setOpenEdit}>
          <JobForm
            onAddJob={onEditJob}
            job={editJob}
            setJob={setEditJob}
            setAllSkills={setAllSkills}
            loading={updateLoading}
          />
        </CustomModal>
      )}
      <ErrSnackbar
        open={openErrBar}
        handleClose={setContErrBar}
        errMsg={error?.message}
      />
    </>
  );
}

interface JobsCardsProps {
  jobs: IJob[] | undefined;
  loading?: boolean;
  updateLoading?: boolean;
  isMyProfile?: boolean;
  onDeleteClick?: (job: IJob) => void;
  onEditClick?: (job: IJob) => void;
}
export const JobsCards = ({
  jobs,
  loading = false,
  updateLoading = false,
  isMyProfile = false,
  onDeleteClick,
  onEditClick,
}: JobsCardsProps) => {
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
          {updateLoading && (
            <Grid item>
              <CardSkeleton />
            </Grid>
          )}
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
                  <Stack direction={"row"} alignItems={"center"}>
                    <Chip
                      variant="outlined"
                      size="small"
                      label={formatRelativeTime(job.createdAt)}
                      icon={<AccessTimeIcon color="inherit" />}
                    />
                    {isMyProfile && onDeleteClick && onEditClick && (
                      <MorePopover
                        onDelete={() => onDeleteClick(job)}
                        onEdit={() => onEditClick(job)}
                      />
                    )}
                  </Stack>
                </Stack>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: "600" }}>
                  {job?.budget?.type}:{" "}
                  <span style={{ opacity: 0.8 }}>
                    ${job?.budget?.from}-${job?.budget?.to}
                  </span>
                  {job?.budget?.type === "Hourly" && (
                    <>
                      {" "}
                      | Max Hours:{" "}
                      <span style={{ opacity: 0.8 }}>
                        {job?.budget?.maxHours}Hrs
                      </span>
                    </>
                  )}
                </Typography>
                <Typography variant="body2">
                  {trimText({ text: job.desc })}
                </Typography>
                <Grid container spacing={1} sx={{ mt: 2 }}>
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
                <Divider sx={{ my: 2 }} />
                <Stack direction={"row"} sx={{ alignItems: "center" }}>
                  <LocationOn
                    sx={{
                      border: "2px solid",
                      padding: 0.4,
                      borderRadius: 5,
                      color: theme.palette.text.light,
                    }}
                  />
                  <Text sx={{ ml: 1 }} type="subtitle">
                    {job?.address?.city}
                  </Text>
                </Stack>
              </Card>
            </Grid>
          ))}
        </>
      )}
    </Grid>
  );
};

const ChipSkeleton = () => (
  <Skeleton
    variant="circular"
    width={60}
    height={20}
    sx={{ borderRadius: 5 }}
  />
);
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

interface IMorePopover {
  onEdit: () => void;
  onDelete: () => void;
}
const MorePopover = ({ onEdit, onDelete }: IMorePopover) => {
  const theme = useTheme();
  const [moreAnchor, setMoreAnchor] = useState<HTMLButtonElement | null>(null);
  const errColor = theme.palette.error.main;

  const openMore = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setMoreAnchor(event.currentTarget);
  };
  const closeMore = () => setMoreAnchor(null);
  const moreIsOpen = Boolean(moreAnchor);
  const moreId = moreIsOpen ? "job-more-popover" : undefined;

  const onEditClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onEdit();
    closeMore();
  };
  const onDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onDelete();
    closeMore();
  };

  const handlePopoverClose = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    closeMore();
  };

  return (
    <Stack>
      <IconButton aria-describedby={moreId} onClick={openMore} size="small">
        <MoreVert />
      </IconButton>
      <Popover
        id={moreId}
        open={moreIsOpen}
        anchorEl={moreAnchor}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <MenuList onMouseLeave={closeMore}>
          <MenuItem onClick={onEditClick}>
            <ListItemIcon>
              <Edit />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem onClick={onDeleteClick} sx={{ color: errColor }}>
            <ListItemIcon sx={{ color: errColor }}>
              <Delete />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </MenuList>
      </Popover>
    </Stack>
  );
};
