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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";

import { IUserInfo } from "@user/userProfile/UserInfo";
import CustomModal from "@reusable/CustomModal";
import PostAJob from "./edits/PostAJob";
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
import { removeServerMetadata, trimText } from "@utils/utilFuncs";
import { paths } from "@routes/PageRoutes";
import { ISkill, useSkills } from "@gqlOps/skill";
import { getNewSkills } from "@appComps/SkillsSelection";
import { useUserStates } from "@redux/reduxStates";

export default function Jobs({ isMyProfile, userId }: IUserInfo) {
  const { userJobsAsync, data, loading, error } = useUserJobs();
  const { createJobAsync, loading: createLoading } = useCreateJob();
  const { updateJobAsync, loading: updateLoading } = useUpdateJob();
  const { deleteJobAsync, loading: deleteLoading } = useDeleteJob();
  const { updateCache } = useSkills();
  const [editJob, setEditJob] = useState<JobInput | IJob>();
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openErrBar, setContErrBar] = useState(false);
  const [allSkills, setAllSkills] = useState<ISkill[]>([]);
  const { userLocation } = useUserStates();

  useEffect(() => {
    if (userId) userJobsAsync({ variables: { userId } });
  }, []);

  const onAddJob = (job: JobInput) => {
    if (userId) {
      createJobAsync({
        variables: { userId, jobInput: job },
        onSuccess: (dt) => {
          const newSkills = getNewSkills({
            newList: dt.skills,
            oldList: allSkills,
          });
          if (newSkills && newSkills?.length > 0)
            updateCache("create", newSkills);
        },
      });
      setOpenAdd(false);
    }
  };

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
        sx={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <Typography variant="h5">Jobs</Typography>
        {isMyProfile && (
          <IconButton onClick={() => setOpenAdd(true)}>
            <AddIcon />
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
      <CustomModal title="Post a new job" open={openAdd} onClose={setOpenAdd}>
        <PostAJob onAddJob={onAddJob} setAllSkills={setAllSkills} />
      </CustomModal>
      {editJob && (
        <CustomModal title="Edit Job" open={openEdit} onClose={setOpenEdit}>
          <JobForm
            onAddJob={onEditJob}
            job={editJob}
            setJob={setEditJob}
            setAllSkills={setAllSkills}
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

  return (
    <Grid container spacing={1} direction={"column"} sx={{ mt: 1 }}>
      {jobs ? (
        <>
          {updateLoading && (
            <Grid item>
              <Skeleton variant="rounded" width={"100%"} height={100} />
            </Grid>
          )}
          {jobs?.map((job) => (
            <Grid item key={job.id}>
              <Card
                sx={{
                  p: 1,
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "light"
                        ? theme.palette.grey[100]
                        : "undefined",
                    backgroundImage:
                      "linear-gradient(rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12))",
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
                  <Typography>{job.title}</Typography>
                  <Stack direction="row" sx={{ alignItems: "center" }}>
                    <Chip
                      label={job?.address?.city}
                      variant="outlined"
                      size="small"
                    />
                    {isMyProfile && onDeleteClick && onEditClick && (
                      <MorePopover
                        onDelete={() => onDeleteClick(job)}
                        onEdit={() => onEditClick(job)}
                      />
                    )}
                  </Stack>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {job?.budget?.type}: ${job?.budget?.from}-$
                  {job?.budget?.to}
                  {job?.budget?.type === "Hourly" &&
                    ` / ${job?.budget?.maxHours}Hrs`}
                </Typography>
                <Typography variant="body2">
                  {trimText({ text: job.desc })}
                </Typography>
                <Grid container spacing={1} sx={{ mt: 2 }}>
                  {job?.skills?.map((skill) => (
                    <Grid item key={skill.label}>
                      <Chip label={skill.label} variant="filled" size="small" />
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Grid>
          ))}
        </>
      ) : (
        loading && (
          <>
            <Grid item>
              <Skeleton variant="rounded" width={"100%"} height={100} />
            </Grid>
            <Grid item>
              <Skeleton variant="rounded" width={"100%"} height={100} />
            </Grid>
            <Grid item>
              <Skeleton variant="rounded" width={"100%"} height={100} />
            </Grid>
          </>
        )
      )}
    </Grid>
  );
};

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
        <MoreVertIcon />
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
              <EditIcon />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem onClick={onDeleteClick} sx={{ color: errColor }}>
            <ListItemIcon sx={{ color: errColor }}>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </MenuList>
      </Popover>
    </Stack>
  );
};
