import { Card, Divider, Stack } from "@mui/material";

import CenteredStack from "@reusable/CenteredStack";
import SearchJobsByText from "@jobs/searchJobs/SearchJobsByText";
import { isDeveloper } from "@utils/auth";
import { useUserStates } from "@redux/reduxStates";
import Text from "@reusable/Text";
import ViewAllUsers from "@user/ViewAllUsers";
import ProfileList from "@components/headerSection/myProfile/ProfileList";
import { useIsMobile, useRespVal } from "@utils/hooks/hooks";
import PostJobBtn from "@components/headerSection/PostJobBtn";

export default function Home() {
  const { user } = useUserStates();
  const isMobile = useIsMobile();

  return (
    <CenteredStack contSX={{ my: 0 }} mmx={0}>
      <Stack direction={"row"}>
        <CenteredStack
          mmx={0}
          contSX={{ mx: 0, width: "100%", my: useRespVal(0, 2) }}
          addCard
        >
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
        </CenteredStack>
        {user && !isMobile && (
          <Stack sx={{ minWidth: 300, ml: 2, mt: 2 }}>
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
