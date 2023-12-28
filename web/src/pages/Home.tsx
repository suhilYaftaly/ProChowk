import { Card, Stack } from "@mui/material";

import SearchJobsByText from "@jobs/searchJobs/SearchJobsByText";
import { useUserStates } from "@redux/reduxStates";
import ProfileList from "@components/headerSection/myProfile/ProfileList";
import { useIsMobile } from "@utils/hooks/hooks";
import PostJobBtn from "@components/headerSection/PostJobBtn";
import AppContainer from "@reusable/AppContainer";
import { isDeveloper } from "@utils/auth";
import ViewAllUsers from "@user/ViewAllUsers";

export default function Home() {
  const { user } = useUserStates();
  const isMobile = useIsMobile();

  return (
    <AppContainer>
      <Stack direction={"row"}>
        <AppContainer addCard sx={{ m: 0, width: "100%" }}>
          <SearchJobsByText />
          {isDeveloper(user?.roles) && <ViewAllUsers />}
        </AppContainer>
        <AppContainer sx={{ m: 0 }}>
          {user && !isMobile && (
            <Stack sx={{ minWidth: 300, ml: 2 }}>
              <Card>
                <ProfileList />
              </Card>
              <PostJobBtn sx={{ mt: 2 }} />
            </Stack>
          )}
        </AppContainer>
      </Stack>
    </AppContainer>
  );
}
