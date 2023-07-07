import { useState } from "react";
import { Stack, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { IUserInfo } from "../user/userProfile/UserInfo";
import CustomModal from "../reusable/CustomModal";
import PostAJob from "./edits/PostAJob";

export default function Jobs({ isMyProfile }: IUserInfo) {
  const [openAdd, setOpenAdd] = useState(false);

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
      <CustomModal title="Post a new job" open={openAdd} onClose={setOpenAdd}>
        <PostAJob />
      </CustomModal>
    </>
  );
}
