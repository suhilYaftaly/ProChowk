import { Chip, Grid, Stack } from "@mui/material";

import { ISectionProps } from "../UserProfile";
import Text from "@reusable/Text";

export default function UserSkills({ contractor, p, tmb }: ISectionProps) {
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
