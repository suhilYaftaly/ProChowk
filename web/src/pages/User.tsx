import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Alert } from "@mui/material";

import UserInfo from "@components/user/userProfile/UserInfo";
import { useUserStates } from "@redux/reduxStates";
import { useUser } from "@gqlOps/user";
import { useContractor } from "@gqlOps/contractor";
import ErrSnackbar from "@reusable/ErrSnackbar";
import { useAppDispatch } from "@/utils/hooks/hooks";
import { setUserProfile } from "@rSlices/userSlice";

export default function User() {
  const { nameId } = useParams();
  const { user: loggedInUser } = useUserStates();
  const userId = nameId?.split("-")?.[1];
  const isMyProfile = userId === loggedInUser?.id;
  const dispatch = useAppDispatch();
  const { userAsync, data: userData, error: userError, loading } = useUser();
  const {
    contractorAsync,
    data: userContrData,
    error: contError,
    loading: contProfLoading,
  } = useContractor();

  const [openContErrBar, setOpenContErrBar] = useState(false);
  const [hideContNFErr, setHideContNFErr] = useState(false);

  useEffect(() => {
    if (userId) {
      userAsync({
        variables: { id: userId },
        onSuccess: (d) => isMyProfile && dispatch(setUserProfile(d)),
      });
    }
  }, [isMyProfile]);

  const user = isMyProfile ? loggedInUser : userData?.user;

  useEffect(() => {
    if (userId && user?.userTypes?.includes("contractor"))
      contractorAsync({ variables: { userId } });
  }, [userId, user]);

  return (
    <>
      {userId && (
        <>
          <UserInfo
            user={user}
            isMyProfile={isMyProfile}
            loading={loading}
            contrData={userContrData?.contractor}
            userId={userId}
            contProfLoading={contProfLoading}
            setHideContNFErr={setHideContNFErr}
          />
          {userError && (
            <Alert severity="error" color="error">
              {userError.message}
            </Alert>
          )}
          {hideContNFErr &&
          contError?.message === "Contractor profile not found" ? null : (
            <ErrSnackbar
              open={openContErrBar}
              handleClose={setOpenContErrBar}
              errMsg={contError?.message}
            />
          )}
        </>
      )}
    </>
  );
}
