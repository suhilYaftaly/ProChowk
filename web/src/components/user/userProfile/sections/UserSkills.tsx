import { Chip, Grid, Skeleton, Stack } from "@mui/material";

import { ISectionProps } from "../UserProfile";
import Text from "@reusable/Text";
import ChipSkeleton from "@reusable/skeleton/ChipSkeleton";

export default function UserSkills({
  contractor,
  p,
  tmb,
  contrLoading,
}: ISectionProps) {
  if (contrLoading) return <SkillsSkeleton p={p} />;
  return (
    <Stack sx={{ p }}>
      <Text type="subtitle">Skills</Text>
      <Grid container spacing={1} direction={"row"} sx={{ mt: tmb }}>
        {contractor?.skills?.map((skill) => (
          <Grid item key={skill.id}>
            <Chip label={skill.label} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

interface SProps {
  p: number;
}
const SkillsSkeleton = ({ p }: SProps) => {
  return (
    <Stack sx={{ p }}>
      <Skeleton variant="text" sx={{ width: 100, mb: 2 }} />
      <Stack direction={"row"} spacing={1}>
        <ChipSkeleton />
        <ChipSkeleton />
        <ChipSkeleton />
      </Stack>
    </Stack>
  );
};
