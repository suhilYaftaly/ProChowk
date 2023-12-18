import { Skeleton, Stack } from "@mui/material";
import { useState } from "react";

import { ISectionProps } from "../UserProfile";
import CustomModal from "@reusable/CustomModal";
import UserAboutEdit from "../edits/UserAboutEdit";
import EditableTitle from "../edits/EditableTitle";
import ShowMoreTxt from "@reusable/ShowMoreTxt";

export default function UserAbout({
  user,
  p,
  userLoading,
  isMyProfile,
}: ISectionProps) {
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <Stack sx={{ p }}>
      <EditableTitle
        title="About"
        isMyProfile={isMyProfile}
        setOpenEdit={setOpenEdit}
      />
      {userLoading ? (
        <Skeleton variant="text" width={300} />
      ) : (
        <ShowMoreTxt text={user?.bio} />
      )}

      {isMyProfile && user && (
        <CustomModal title="About you" open={openEdit} onClose={setOpenEdit}>
          <UserAboutEdit user={user} onClose={() => setOpenEdit(false)} />
        </CustomModal>
      )}
    </Stack>
  );
}
