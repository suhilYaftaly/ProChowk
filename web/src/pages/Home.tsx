import { Card, Stack } from "@mui/material";

import SearchNearbyJobs from "@jobs/searchJobs/SearchNearbyJobs";
import { useUserStates } from "@redux/reduxStates";
import UserMenuOptions from "@/components/headerSection/myProfile/UserMenuOptions";
import { useIsMobile } from "@utils/hooks/hooks";
import PostJobBtn from "@components/headerSection/PostJobBtn";
import AppContainer from "@reusable/AppContainer";
import { isDeveloper } from "@utils/auth";
import ViewAllUsers from "@user/ViewAllUsers";
import SearchNearbyContractors from "@user/contractor/SearchNearbyContractors";
import { EnableUserLocation } from "@user/userLocation/UseUserLocation";

export default function Home() {
  const { user, userView } = useUserStates();
  const isMobile = useIsMobile();
  const { userLocation } = useUserStates();
  const latLng = userLocation?.data;

  return (
    <AppContainer>
      <Stack direction={"row"}>
        <AppContainer addCard sx={{ m: 0, width: "100%" }}>
          {user && userView === "Contractor" ? (
            <SearchNearbyJobs />
          ) : (
            <SearchNearbyContractors />
          )}
          {!latLng && <EnableUserLocation />}
          {isDeveloper(user?.roles) && <ViewAllUsers />}
        </AppContainer>
        <AppContainer sx={{ m: 0 }}>
          {user && !isMobile && (
            <Stack sx={{ minWidth: 300, ml: 2 }}>
              <Card>
                <UserMenuOptions />
              </Card>
              <PostJobBtn sx={{ mt: 2 }} />
            </Stack>
          )}
        </AppContainer>
      </Stack>
    </AppContainer>
  );
}
