import { useState, useEffect, MouseEvent } from "react";
import {
  Stack,
  Typography,
  IconButton,
  Card,
  CardContent,
  Chip,
  Grid,
  Skeleton,
  Popover,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { IUserInfo } from "@user/userProfile/UserInfo";
import CustomModal from "@reusable/CustomModal";
import PostAJob from "./edits/PostAJob";
import JobForm from "./edits/JobForm";
import { IJob, JobInput, useGetUserJobs, useUpdateJob } from "@gqlOps/jobs";
import ErrSnackbar from "@reusable/ErrSnackbar";
import { removeTypename } from "@utils/utilFuncs";

export default function Jobs({ isMyProfile, userId }: IUserInfo) {
  const { getUserJobsAsync, data, loading, error } = useGetUserJobs();
  const { updateJobAsync, deleteJobAsync, updateLoading } = useUpdateJob();
  const [editJob, setEditJob] = useState<JobInput | IJob>();
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openErrBar, setContErrBar] = useState(false);

  useEffect(() => {
    getUserJobsAsync({ userId });
  }, []);

  const onAddJob = (job: JobInput) => {
    if (userId) {
      updateJobAsync({ props: job, userId });
      setOpenAdd(false);
    }
  };

  const onEditJob = (j: IJob | any) => {
    if (userId && j.id) {
      const cleanedJob = removeTypename(j);
      updateJobAsync({
        userId,
        id: j.id,
        props: {
          title: cleanedJob.title,
          desc: cleanedJob.desc,
          jobSize: cleanedJob.jobSize,
          budget: cleanedJob.budget,
          skills: cleanedJob.skills,
          images: cleanedJob.images,
          address: cleanedJob.address,
        },
      });
      setOpenEdit(false);
    }
  };

  const onDeleteClick = (j: IJob | any) => {
    if (userId && j.id) deleteJobAsync({ userId, id: j.id });
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
      <Grid container spacing={1} direction={"column"} sx={{ mt: 1 }}>
        {data ? (
          <>
            {updateLoading && (
              <Grid item>
                <Skeleton variant="rounded" width={"100%"} height={100} />
              </Grid>
            )}
            {data?.map((job) => (
              <Grid item key={job.id}>
                <Card sx={{ p: 1 }}>
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
                        label={job.address?.city}
                        variant="outlined"
                        size="small"
                      />
                      {isMyProfile && (
                        <MorePopover
                          onDelete={() => onDeleteClick(job)}
                          onEdit={() => onEditClick(job)}
                        />
                      )}
                    </Stack>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {job.budget.type}: ${job.budget.from}-${job.budget.to}
                    {job.budget.type === "Hourly" &&
                      ` /${" "}
                    ${job.budget.maxHours}Hrs`}
                  </Typography>
                  <Typography variant="body2">{job.desc}</Typography>
                  <Grid container spacing={1} sx={{ mt: 2 }}>
                    {job.skills?.map((skill) => (
                      <Grid item key={skill.label}>
                        <Chip
                          label={skill.label}
                          variant="filled"
                          size="small"
                        />
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
      <CustomModal title="Post a new job" open={openAdd} onClose={setOpenAdd}>
        <PostAJob onAddJob={onAddJob} />
      </CustomModal>
      {editJob && (
        <CustomModal title="Edit Job" open={openEdit} onClose={setOpenEdit}>
          <JobForm onAddJob={onEditJob} job={editJob} setJob={setEditJob} />
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

interface IMorePopover {
  onEdit: () => void;
  onDelete: () => void;
}

const MorePopover = ({ onEdit, onDelete }: IMorePopover) => {
  const theme = useTheme();
  const [moreAnchor, setMoreAnchor] = useState<HTMLButtonElement | null>(null);
  const errColor = theme.palette.error.main;

  const openMore = (event: MouseEvent<HTMLButtonElement>) => {
    setMoreAnchor(event.currentTarget);
  };
  const closeMore = () => setMoreAnchor(null);
  const moreIsOpen = Boolean(moreAnchor);
  const moreId = moreIsOpen ? "job-more-popover" : undefined;

  const onEditClick = () => {
    onEdit();
    closeMore();
  };
  const onDeleteClick = () => {
    onDelete();
    closeMore();
  };

  return (
    <>
      <IconButton aria-describedby={moreId} onClick={openMore} size="small">
        <MoreVertIcon />
      </IconButton>
      <Popover
        id={moreId}
        open={moreIsOpen}
        anchorEl={moreAnchor}
        onClose={closeMore}
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
    </>
  );
};
