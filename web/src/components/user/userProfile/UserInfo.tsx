import { Paper, Stack } from "@mui/material";

import UserBasicInfo from "./UserBasicInfo";
import { ppx, ppy } from "@config/configConst";
import UserSkills from "@contractor/UserSkills";
import UserLicenses from "@contractor/UserLicenses";
import { IUser } from "@gqlOps/user";
import { IContractor } from "@gqlOps/contractor";
import UserCreateContProf from "./edits/UserCreateContProf";
import ShowIncompleteAlerts from "@contractor/ShowIncompleteAlerts";
import Jobs from "@jobs/Jobs";
import { useRespVal } from "@utils/hooks/hooks";
import CenteredStack from "@reusable/CenteredStack";

export interface IUserInfo {
  user?: IUser | undefined;
  isMyProfile?: boolean;
  loading?: boolean;
  contrData?: IContractor | undefined;
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
  const paperContStyle = {
    px: ppx,
    py: ppy,
    borderRadius: useRespVal(0, undefined),
    borderRight: useRespVal(0, undefined),
    borderLeft: useRespVal(0, undefined),
  };
  return (
    <CenteredStack>
      <Stack spacing={1}>
        <Paper variant="outlined" sx={paperContStyle}>
          <UserBasicInfo
            user={user}
            isMyProfile={isMyProfile}
            loading={loading}
          />
        </Paper>
        {user?.userTypes?.includes("contractor") ? (
          <>
            <ShowIncompleteAlerts
              user={user}
              isMyProfile={isMyProfile}
              contrData={contrData}
              contProfLoading={contProfLoading}
            />
            <Paper variant="outlined" sx={paperContStyle}>
              <UserSkills
                user={user}
                isMyProfile={isMyProfile}
                contrData={contrData}
                contProfLoading={contProfLoading}
              />
            </Paper>
            <Paper variant="outlined" sx={paperContStyle}>
              <UserLicenses
                user={user}
                isMyProfile={isMyProfile}
                contrData={contrData}
                contProfLoading={contProfLoading}
              />
            </Paper>
          </>
        ) : (
          isMyProfile &&
          userId && (
            <UserCreateContProf
              user={user}
              userId={userId}
              setHideContNFErr={setHideContNFErr}
            />
          )
        )}
        <Paper variant="outlined" sx={paperContStyle}>
          <Jobs isMyProfile={isMyProfile} userId={userId} user={user} />
        </Paper>
      </Stack>
    </CenteredStack>
  );
}
