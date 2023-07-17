import { useParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Alert } from "@mui/material";

import UserInfo from "@components/user/userProfile/UserInfo";
import { useUserStates } from "@redux/reduxStates";
import userOps, { ISearchUserData, ISearchUserInput } from "@gqlOps/user";
import contOps, {
  ISearchContrProfData,
  ISearchContrProfInput,
} from "@gqlOps/contractor";
import ErrSnackbar from "@/components/reusable/ErrSnackbar";

export default function User() {
  const { nameId } = useParams();
  const { user: loggedInUser } = useUserStates();
  const userId = nameId?.split("-")?.[1];
  const isMyProfile = userId === loggedInUser?.id;
  const [searchUser, { data: userData, loading, error: userError }] =
    useLazyQuery<ISearchUserData, ISearchUserInput>(userOps.Queries.searchUser);
  const [
    searchContrProf,
    { data: userContrData, error: contError, loading: contProfLoading },
  ] = useLazyQuery<ISearchContrProfData, ISearchContrProfInput>(
    contOps.Queries.searchContrProf
  );
  const [openContErrBar, setOpenContErrBar] = useState(false);
  const [hideContNFErr, setHideContNFErr] = useState(false);

  const getUser = async () => {
    if (userId) {
      try {
        const { data } = await searchUser({
          variables: { id: userId },
        });
        if (!data?.searchUser) throw new Error();
      } catch (error: any) {
        console.log("get user info error:", error.message);
      }
    }
  };

  const getContrProf = async () => {
    if (userId) {
      try {
        const { data } = await searchContrProf({
          variables: { userId },
        });
        if (!data?.searchContrProf) throw new Error();
      } catch (error: any) {
        setOpenContErrBar(true);
        console.log("get user info error:", error.message);
      }
    }
  };

  //retriev user info if its not my profile
  useEffect(() => {
    if (userId && !isMyProfile) getUser();
  }, [isMyProfile]);

  const user = isMyProfile ? loggedInUser : userData?.searchUser;

  useEffect(() => {
    if (userId && user?.userType?.includes("contractor")) getContrProf();
  }, [userId, user]);

  return (
    <>
      {userId && (
        <>
          <UserInfo
            user={user}
            isMyProfile={isMyProfile}
            loading={loading}
            contrData={userContrData?.searchContrProf}
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
