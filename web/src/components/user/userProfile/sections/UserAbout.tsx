import { Skeleton, Stack } from "@mui/material";

import { ISectionProps } from "../UserProfile";
import Text from "@reusable/Text";

export default function UserAbout({
  user,
  p,
  tmb,
  userLoading,
}: ISectionProps) {
  if (userLoading) return <AboutSkeleton p={p} />;
  return (
    <Stack sx={{ p }}>
      <Text type="subtitle">About</Text>
      {user?.bio && <Text sx={{ mt: tmb }}>{user?.bio}</Text>}
      {/* <ShowMoreTxt text={user?.bio} /> */}
    </Stack>
  );
}

interface SProps {
  p: number;
}
const AboutSkeleton = ({ p }: SProps) => {
  return (
    <Stack sx={{ p }}>
      <Skeleton variant="text" sx={{ width: 100, mb: 1 }} />
      <Skeleton variant="text" width={300} />
    </Stack>
  );
};
