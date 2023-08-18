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
import { IUserInfo } from "@user/userProfile/UserInfo";
import UserSkillsEdit from "./edits/UserSkillsEdit";

export default function UserSkills({
  isMyProfile,
  contrData,
  contProfLoading,
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
      <Grid container spacing={1} direction={"row"} sx={{ mt: 1 }}>
        {contrData?.skills
          ? contrData?.skills?.map((skill) => (
              <Grid item key={skill.id}>
                <Chip label={skill.label} />
              </Grid>
            ))
          : contProfLoading && (
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
          contrData={contrData}
          closeEdit={() => setOpenEdit(false)}
        />
      </CustomModal>
    </>
  );
}
