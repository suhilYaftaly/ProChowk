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
    // !contrData?.licenses ||
    // contrData?.licenses?.length < 0 ||
    !contrData?.skills ||
    contrData?.skills?.length < 0;

  return (
    <>
      {isMyProfile && !contProfLoading && isContProfIncomplete && (
        <Card sx={{ boxShadow: 4, p: 2 }}>
          <Alert
            severity="error"
            color="error"
            sx={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              alignItems: "center",
            }}
          >
            Your contractor profile is incomplete!
            {!user?.phoneNum && "\nYou must add your phone number!"}
            {!user?.bio && "\nYou must add your biography!"}
            {!user?.address && "\nYou must add your address!"}
            {(!contrData?.skills || contrData?.skills?.length < 0) &&
              "\nYou must select some skills!"}
            {/* {(!contrData?.licenses || contrData?.licenses?.length < 0) &&
              "\nYou must add your licenses!"} */}
          </Alert>
        </Card>
      )}
    </>
  );
}
