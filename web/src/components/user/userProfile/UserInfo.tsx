import { Alert, Card, Stack } from "@mui/material";

import UserBasicInfo from "./UserBasicInfo";
import { pp } from "@/config/configConst";
import UserSkills from "./UserSkills";
import UserLicenses from "./UserLicenses";
import { IUserData } from "@gqlOps/user";
import { IContractorData } from "@gqlOps/contractor";
import UserCreateContProf from "./edits/UserCreateContProf";
// import UserJobs from "./UserJobs";

export interface IUserInfo {
  user: IUserData | undefined;
  isMyProfile?: boolean;
  loading?: boolean;
  contrData?: IContractorData | null;
  userId?: string;
  contProfLoading?: boolean;
}

export default function UserInfo({
  user,
  loading,
  isMyProfile,
  contrData,
  userId,
  contProfLoading,
}: IUserInfo) {
  const isContProfIncomplete =
    !contrData?.licenses ||
    contrData?.licenses?.length < 0 ||
    !contrData?.skills ||
    contrData?.skills?.length < 0;

  return (
    <Stack
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        m: pp,
      }}
    >
      <Stack spacing={1} sx={{ maxWidth: 700 }}>
        <Card sx={{ boxShadow: 4, p: 2 }}>
          <UserBasicInfo
            user={user}
            isMyProfile={isMyProfile}
            loading={loading}
          />
        </Card>
        {user?.userType?.includes("contractor") ? (
          <>
            {!contProfLoading && isContProfIncomplete && (
              <Card sx={{ boxShadow: 4, p: 2 }}>
                <Alert severity="error" color="error">
                  Your contractor profile is incomplete!
                </Alert>
              </Card>
            )}
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
              <UserJobs
                user={user}
                isMyProfile={isMyProfile}
                contrData={contrData}
                userId={userId}
                contProfLoading={contProfLoading}
              />
            </Card> */}
          </>
        ) : (
          isMyProfile && userId && <UserCreateContProf userId={userId} />
        )}
      </Stack>
    </Stack>
  );
}
