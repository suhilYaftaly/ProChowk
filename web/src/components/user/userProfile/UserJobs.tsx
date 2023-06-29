import {
  Typography,
  Grid,
  Stack,
  IconButton,
  Skeleton,
  Card,
  CardContent,
} from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

import CustomModal from "@reusable/CustomModal";
import { IUserInfo } from "./UserInfo";
import UserAddJob from "./edits/UserAddJob";
import { Job } from "./edits/UserJobForm";
import UserEditJob from "./edits/UserEditJob";

export default function UserJobs({ isMyProfile, contProfLoading }: IUserInfo) {
  const [openAdd, setOpenAdd] = useState(false);
  const [jobs, setJobs] = useState<Job[] | undefined>();
  const [editJob, setEditJob] = useState<Job | undefined>();
  const [openEdit, setOpenEdit] = useState(false);

  const onEditClick = (job: Job) => {
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
                      }}
                    >
                      <Typography gutterBottom variant="h5">
                        {job.title}
                      </Typography>
                      <IconButton onClick={() => onEditClick(job)}>
                        <EditIcon />
                      </IconButton>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {job.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          : contProfLoading && (
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
      <CustomModal title="Add New Job" open={openAdd} onClose={setOpenAdd}>
        <UserAddJob setJobs={setJobs} closeEdit={() => setOpenAdd(false)} />
      </CustomModal>
      {editJob && (
        <CustomModal title="Edit Job" open={openEdit} onClose={setOpenEdit}>
          <UserEditJob
            job={editJob}
            setJob={setEditJob}
            setJobs={setJobs}
            closeEdit={() => setOpenEdit(false)}
          />
        </CustomModal>
      )}
    </>
  );
}
