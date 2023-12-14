import { Stack } from "@mui/material";

import { ISectionProps } from "../UserProfile";
import Text from "@reusable/Text";

export default function UserAbout({ user, p, tmb }: ISectionProps) {
  return (
    <Stack sx={{ p }}>
      <Text type="subtitle">About</Text>
      {user?.bio && <Text sx={{ mt: tmb }}>{user?.bio}</Text>}
      {/* <ShowMoreTxt text={user?.bio} /> */}
    </Stack>
  );
}
