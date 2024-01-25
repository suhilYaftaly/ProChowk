import { Divider, Grid } from "@mui/material";

import AppContainer from "@reusable/AppContainer";
import { IContractor } from "@gqlOps/contractor";
import { IUser } from "@gqlOps/user";
import UserProfileInfo from "./sections/UserProfileInfo";
import UserAbout from "./sections/UserAbout";
import UserSkills from "./sections/UserSkills";
import UserLicenses from "./sections/UserLicenses";
import { isContractor } from "@/utils/auth";
import { TUserReviewsData } from "@gqlOps/review";
import UserReviews from "./sections/UserReviews";

export interface ISectionProps extends IUserProfile {
  /**padding */
  p: number;
  /**title margin bottom */
  tmb: number;
}
interface IUserProfile {
  user: IUser | undefined;
  isMyProfile: boolean;
  userLoading: boolean;
  contractor: IContractor | undefined;
  contrLoading: boolean;
  averageRating?: number;
  reviewsData?: TUserReviewsData;
}
export default function UserProfile({
  user,
  isMyProfile,
  userLoading,
  contractor,
  contrLoading,
  reviewsData,
}: IUserProfile) {
  const p = 2;
  const sectionProps = {
    user,
    isMyProfile,
    userLoading,
    contractor,
    contrLoading,
    p,
    tmb: 1,
    averageRating: reviewsData?.averageRating,
  };

  return (
    <AppContainer>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <AppContainer addCard sx={{ m: 0 }} cardSX={{ p: 0 }}>
            <UserProfileInfo {...sectionProps} />
            {(user?.bio || isMyProfile) && (
              <>
                <Divider />
                <UserAbout {...sectionProps} />
              </>
            )}
            {isContractor(user?.userTypes) && (
              <>
                <Divider />
                <UserSkills {...sectionProps} />
                <Divider />
                <UserLicenses {...sectionProps} />
                {reviewsData && (
                  <>
                    <Divider />
                    <UserReviews
                      reviewsData={reviewsData}
                      p={p}
                      tmb={sectionProps.tmb}
                    />
                  </>
                )}
              </>
            )}
          </AppContainer>
        </Grid>
        {/* <Grid item xs={12} md={3.7}>
          <AppContainer addCard sx={{ m: 0 }}>
            <UserProjectsMini {...sectionProps} />
          </AppContainer>
        </Grid> */}
      </Grid>
    </AppContainer>
  );
}
