import { useParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { useEffect } from "react";

import UserInfo from "@/components/user/userProfile/UserInfo";
import { useUserStates } from "@/redux/reduxStates";
import userOps, { ISearchUserData, ISearchUserInput } from "@gqlOps/user";
import contOps, {
  ISearchContrProfData,
  ISearchContrProfInput,
} from "@gqlOps/contractor";

export default function User() {
  const { nameId } = useParams();
  const { user: loggedInUser } = useUserStates();
  const userId = nameId?.split("-")?.[1];
  const isMyProfile = userId === loggedInUser?.id;
  const [searchUser, { data: userData, loading }] = useLazyQuery<
    ISearchUserData,
    ISearchUserInput
  >(userOps.Queries.searchUser);
  const [searchContrProf, { data: userContrData }] = useLazyQuery<
    ISearchContrProfData,
    ISearchContrProfInput
  >(contOps.Queries.searchContrProf);

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
        console.log("get user info error:", error.message);
      }
    }
  };

  //retriev user info if its not my profile
  useEffect(() => {
    if (userId && loggedInUser?.id && !isMyProfile) getUser();
  }, [isMyProfile]);

  useEffect(() => {
    if (userId) getContrProf();
  }, [userId]);

  const user = isMyProfile ? loggedInUser : userData?.searchUser;
  const contrData = isMyProfile ? userContrData?.searchContrProf : null;

  return (
    <>
      {user && (
        <UserInfo
          user={user}
          isMyProfile={isMyProfile}
          loading={loading}
          contrData={contrData}
          userId={userId}
        />
      )}
    </>
  );
}
