import { Card, Stack } from "@mui/material";

import UserBasicInfo from "./UserBasicInfo";
import { pp } from "@/config/configConst";
import UserSkills from "./UserSkills";
import UserLicenses from "./UserLicenses";
import { IUserData } from "@gqlOps/user";
import { IContractorData } from "@gqlOps/contractor";

export interface IUserInfo {
  user: IUserData | undefined;
  isMyProfile?: boolean;
  loading?: boolean;
  contrData?: IContractorData | null;
  userId?: string;
}

export default function UserInfo({
  user,
  loading,
  isMyProfile,
  contrData,
  userId,
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
      <Stack spacing={1} sx={{ maxWidth: 700 }}>
        <Card sx={{ boxShadow: 4, p: 2 }}>
          <UserBasicInfo
            user={user}
            isMyProfile={isMyProfile}
            loading={loading}
          />
        </Card>
        <Card sx={{ boxShadow: 4, p: 2 }}>
          <UserSkills
            user={user}
            isMyProfile={isMyProfile}
            contrData={contrData}
            userId={userId}
          />
        </Card>
        <Card sx={{ boxShadow: 4, p: 2 }}>
          <UserLicenses />
        </Card>
      </Stack>
    </Stack>
  );
}
