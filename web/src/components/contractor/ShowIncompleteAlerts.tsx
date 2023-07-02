import { Card, Alert } from "@mui/material";
import { IUserInfo } from "../user/userProfile/UserInfo";

export interface Props extends IUserInfo {}
export default function ShowIncompleteAlerts({
  user,
  contrData,
  contProfLoading,
  isMyProfile,
}: Props) {
  const isContProfIncomplete =
    !user?.address ||
    !user?.bio ||
    !user?.phoneNum ||
    !contrData?.licenses ||
    contrData?.licenses?.length < 0 ||
    !contrData?.skills ||
    contrData?.skills?.length < 0;

  return (
    <>
      {isMyProfile && !contProfLoading && isContProfIncomplete && (
        <Card sx={{ boxShadow: 4, p: 2 }}>
          <Alert severity="error" color="error">
            Your contractor profile is incomplete!
          </Alert>
          {!user?.phoneNum && (
            <Alert severity="error" color="error" sx={{ mt: 1 }}>
              You must add your phone number
            </Alert>
          )}
          {!user?.bio && (
            <Alert severity="error" color="error" sx={{ mt: 1 }}>
              You must add your biography
            </Alert>
          )}
          {!user?.address && (
            <Alert severity="error" color="error" sx={{ mt: 1 }}>
              You must add your address
            </Alert>
          )}
          {(!contrData?.skills || contrData?.skills?.length < 0) && (
            <Alert severity="error" color="error" sx={{ mt: 1 }}>
              You must select some skills
            </Alert>
          )}
          {(!contrData?.licenses || contrData?.licenses?.length < 0) && (
            <Alert severity="error" color="error" sx={{ mt: 1 }}>
              You must add your licenses
            </Alert>
          )}
        </Card>
      )}
    </>
  );
}
