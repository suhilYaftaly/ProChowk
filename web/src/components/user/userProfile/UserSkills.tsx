import {
  Typography,
  Chip,
  Grid,
  Stack,
  IconButton,
  Skeleton,
} from "@mui/material";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";

import CustomModal from "@reusable/CustomModal";
import { IUserInfo } from "./UserInfo";
import UserSkillsEdit from "./edits/UserSkillsEdit";

export default function UserSkills({
  isMyProfile,
  contrData,
  userId,
}: IUserInfo) {
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <>
      <Stack
        direction={"row"}
        sx={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <Typography variant="h5">Skills</Typography>

        {isMyProfile && (
          <IconButton onClick={() => setOpenEdit(true)}>
            <EditIcon />
          </IconButton>
        )}
      </Stack>
      <Grid container spacing={1} direction={"row"} sx={{ mt: 2 }}>
        {contrData?.skills ? (
          contrData?.skills?.map((skill) => (
            <Grid item key={skill.label}>
              <Chip label={skill.label} color="primary" />
            </Grid>
          ))
        ) : (
          <>
            <Grid item>
              <Skeleton variant="circular" width={50} height={50} />
            </Grid>
            <Grid item>
              <Skeleton variant="circular" width={50} height={50} />
            </Grid>
            <Grid item>
              <Skeleton variant="circular" width={50} height={50} />
            </Grid>
            <Grid item>
              <Skeleton variant="circular" width={50} height={50} />
            </Grid>
          </>
        )}
      </Grid>
      <CustomModal title="Edit Skills" open={openEdit} onClose={setOpenEdit}>
        <UserSkillsEdit
          userSkills={contrData?.skills}
          userId={userId}
          closeEdit={() => setOpenEdit(false)}
        />
      </CustomModal>
    </>
  );
}
