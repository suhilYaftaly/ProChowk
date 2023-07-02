import { Alert, Card, Stack } from "@mui/material";

import UserBasicInfo from "./UserBasicInfo";
import { layoutCardsMaxWidth, pp } from "@/config/configConst";
import UserSkills from "@contractor/UserSkills";
import UserLicenses from "@contractor/UserLicenses";
import { IUserData } from "@gqlOps/user";
import { IContractorData } from "@gqlOps/contractor";
import UserCreateContProf from "./edits/UserCreateContProf";
import ShowIncompleteAlerts from "@contractor/ShowIncompleteAlerts";
// import Ads from "@advs/Ads";

export interface IUserInfo {
  user?: IUserData | undefined;
  isMyProfile?: boolean;
  loading?: boolean;
  contrData?: IContractorData | undefined;
  userId?: string;
  contProfLoading?: boolean;
  setHideContNFErr?: (hide: boolean) => void;
}

export default function UserInfo({
  user,
  loading,
  isMyProfile,
  contrData,
  userId,
  contProfLoading,
  setHideContNFErr,
}: IUserInfo) {
  return (
    <Stack
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        m: pp,
      }}
    >
      <Stack spacing={1} sx={{ maxWidth: layoutCardsMaxWidth }}>
        <Card sx={{ boxShadow: 4, p: 2 }}>
          <UserBasicInfo
            user={user}
            isMyProfile={isMyProfile}
            loading={loading}
          />
        </Card>
        {user?.userType?.includes("contractor") ? (
          <>
            <ShowIncompleteAlerts
              user={user}
              contrData={contrData}
              contProfLoading={contProfLoading}
            />
            <Card sx={{ boxShadow: 4, p: 2 }}>
              <UserSkills
                user={user}
                isMyProfile={isMyProfile}
                contrData={contrData}
                userId={userId}
                contProfLoading={contProfLoading}
              />
            </Card>
            <Card sx={{ boxShadow: 4, p: 2 }}>
              <UserLicenses
                user={user}
                isMyProfile={isMyProfile}
                contrData={contrData}
                contProfLoading={contProfLoading}
              />
            </Card>
            {/* <Card sx={{ boxShadow: 4, p: 2 }}>
              <Ads
                user={user}
                isMyProfile={isMyProfile}
                contrData={contrData}
                userId={userId}
                contProfLoading={contProfLoading}
              />
            </Card> */}
          </>
        ) : (
          isMyProfile &&
          userId && (
            <UserCreateContProf
              userId={userId}
              setHideContNFErr={setHideContNFErr}
            />
          )
        )}
      </Stack>
    </Stack>
  );
}
