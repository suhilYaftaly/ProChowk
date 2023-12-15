import { Chip, Grid, Stack } from "@mui/material";

import { ISectionProps } from "../UserProfile";
import Text from "@reusable/Text";
import ChipSkeleton from "@reusable/skeleton/ChipSkeleton";

export default function UserSkills({
  contractor,
  p,
  tmb,
  contrLoading,
}: ISectionProps) {
  return (
    <Stack sx={{ p }}>
      <Text type="subtitle">Skills</Text>
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
