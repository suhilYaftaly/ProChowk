import { useState } from "react";
import {
  Stack,
  Typography,
  IconButton,
  Card,
  CardContent,
  Chip,
  Grid,
  Skeleton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { IUserInfo } from "../user/userProfile/UserInfo";
import CustomModal from "../reusable/CustomModal";
import PostAJob from "./edits/PostAJob";
import JobForm, { IJob } from "./edits/JobForm";

export default function Jobs({ isMyProfile }: IUserInfo) {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [editJob, setEditJob] = useState<IJob>();
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const onAddJob = (job: IJob) => {
    setJobs((pv) => [...pv, job]);
    setOpenAdd(false);
  };

  const onEditJob = (job: IJob) => {
    setJobs((pv) => pv.map((j) => (j.id === job.id ? job : j)));
    setOpenEdit(false);
  };

  const onDeleteClick = (job: IJob) => {
    setJobs((pv) => pv && pv.filter((item) => item.id !== job.id));
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
        {jobs
          ? jobs?.map((job) => (
              <Grid item key={job.id}>
                <Card raised>
                  <CardContent>
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
                          sx={{ mr: 1 }}
                          size="small"
                        />
                        {isMyProfile && (
                          <>
                            <IconButton
                              onClick={() => onEditClick(job)}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => onDeleteClick(job)}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </>
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
                  </CardContent>
                </Card>
              </Grid>
            ))
          : false && (
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
    </>
  );
}
