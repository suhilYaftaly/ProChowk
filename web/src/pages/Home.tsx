import { Card, Divider, Stack } from "@mui/material";

import CenteredStack from "@reusable/CenteredStack";
import SearchJobsByText from "@/components/jobs/searchJobs/SearchJobsByText";
import { isDeveloper } from "@/utils/auth";
import { useUserStates } from "@/redux/reduxStates";
import Text from "@reusable/Text";
import ViewAllUsers from "@user/ViewAllUsers";
import ProfileList from "@/components/headerSection/myProfile/ProfileList";
import { useIsMobile } from "@/utils/hooks/hooks";
import PostJobBtn from "@/components/headerSection/PostJobBtn";

export default function Home() {
  const { user } = useUserStates();
  const isMobile = useIsMobile();

  return (
    <CenteredStack>
      <Stack direction={"row"}>
        <div style={{ width: "100%" }}>
          <SearchJobsByText />
          {isDeveloper(user?.roles) && (
            <>
              <Divider sx={{ my: 3 }} />
              <Text type="subtitle" sx={{ mb: 2 }} cColor="info">
                ℹ👉 Showing below users profile to (DEVS) only for testing
                purposes.
              </Text>
              <ViewAllUsers />
            </>
          )}
        </div>
        {user && !isMobile && (
          <Stack sx={{ minWidth: 300, ml: 2 }}>
            <Card>
              <ProfileList />
            </Card>
            <PostJobBtn sx={{ mt: 2 }} />
          </Stack>
        )}
      </Stack>
    </CenteredStack>
  );
}
