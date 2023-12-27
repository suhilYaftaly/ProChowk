import { useParams } from "react-router-dom";
import { useEffect } from "react";

import { useSettingsStates, useUserStates } from "@redux/reduxStates";
import { useUser } from "@gqlOps/user";
import { useContractor } from "@gqlOps/contractor";
import { useAppDispatch } from "@/utils/hooks/hooks";
import { setUserProfile } from "@rSlices/userSlice";
import UserProfile from "@user/userProfile/UserProfile";
import { isContractor } from "@/utils/auth";

export default function User() {
  const { nameId } = useParams();
  const { user: loggedInUser } = useUserStates();
  const { isAppLoaded } = useSettingsStates();
  const userId = nameId?.split("-")?.[1];
  const isMyProfile = userId === loggedInUser?.id;
  const dispatch = useAppDispatch();
  const { userAsync, data: userData, loading } = useUser();
  const {
    contractorAsync,
    data: contrData,
    loading: contrLoading,
  } = useContractor();

  //retrieve user
  useEffect(() => {
    if (userId && isAppLoaded) {
      userAsync({
        variables: { id: userId },
        onSuccess: (d) => isMyProfile && dispatch(setUserProfile(d)),
      });
    }
  }, [isMyProfile, isAppLoaded]);

  const user = userData?.user;

  //retrieve contractor
  useEffect(() => {
    if (userId && isContractor(user?.userTypes))
      contractorAsync({ variables: { userId } });
  }, [userId, user]);

  return (
    <UserProfile
      user={user}
      isMyProfile={isMyProfile}
      userLoading={loading}
      contractor={contrData?.contractor}
      contrLoading={contrLoading}
    />
  );
}
