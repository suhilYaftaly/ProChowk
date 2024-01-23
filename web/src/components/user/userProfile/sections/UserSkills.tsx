import { Chip, Grid, Stack } from "@mui/material";
import { useState } from "react";

import { ISectionProps } from "../UserProfile";
import ChipSkeleton from "@reusable/skeleton/ChipSkeleton";
import EditableTitle from "../edits/EditableTitle";
import CustomModal from "@reusable/CustomModal";
import UserSkillsEdit from "../edits/UserSkillsEdit";

export default function UserSkills({
  contractor,
  p,
  tmb,
  contrLoading,
  isMyProfile,
}: ISectionProps) {
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <Stack sx={{ p }}>
      <EditableTitle
        title={`Skills (${contractor?.skills?.length})`}
        isMyProfile={isMyProfile}
        setOpenEdit={setOpenEdit}
      />
      <Grid container spacing={1} direction={"row"} sx={{ mt: tmb }}>
        {contrLoading ? (
          <SkillsSkeleton />
        ) : (
          contractor?.skills?.map((skill) => (
            <Grid item key={skill.id}>
              <Chip label={skill.label} />
            </Grid>
          ))
        )}
      </Grid>
      {isMyProfile && contractor && (
        <CustomModal title="Skills" open={openEdit} onClose={setOpenEdit}>
          <UserSkillsEdit
            contractor={contractor}
            onClose={() => setOpenEdit(false)}
          />
        </CustomModal>
      )}
    </Stack>
  );
}

const SkillsSkeleton = () => (
  <>
    <Grid item>
      <ChipSkeleton />
    </Grid>
    <Grid item>
      <ChipSkeleton />
    </Grid>
    <Grid item>
      <ChipSkeleton />
    </Grid>
  </>
);
