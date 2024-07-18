import { StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';
import { Button, ScrollView } from 'tamagui';
import { useSettingsStates, useUserStates } from '~/src/redux/reduxStates';
import { useUser } from '~/src/graphql/operations/user';
import { useContractor } from '~/src/graphql/operations/contractor';
import { useGetUserReviews } from '~/src/graphql/operations/review';
import { isContractor } from '~/src/utils/auth';
import ProfileHeader from './ProfileHeader';
import CustomContentLoader from '../../reusable/CustomContentLoader';
import UserBio from './UserBio';
import UserSkills from './UserSkills';
import UserLicenses from './UserLicenses';
import UserReview from './UserReview';
import { USER_PROFILE } from '~/src/constants/localStorageKeys';
import { saveDataInAsyncStore } from '~/src/utils/asyncStorage';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';
import labels from '~/src/constants/labels';
import UserPortfolios from './UserPortfolios';
import { useContractorPortfolio } from '~/src/graphql/operations/contractorPortfolio';

type Props = {
  userId?: string | string[];
};

const Profile = ({ userId }: Props) => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { user: loggedInUser } = useUserStates();
  const { isAppLoaded } = useSettingsStates();
  const isMyProfile = userId === loggedInUser?.id;
  const { userAsync, data: userData, loading } = useUser();
  const { contractorAsync, data: contrData, loading: contrLoading } = useContractor();
  const { getUserReviewsAsync, data: reviewsData, loading: reviewLoading } = useGetUserReviews();
  const { getContractorPortfoliosAsync, data: portfoliosData } = useContractorPortfolio();
  const user = userData?.user;
  const userReviews = reviewsData?.getUserReviews;
  const contractorData = contrData?.contractor;
  const userPortfolios = portfoliosData?.getContractorPortfolios;

  //retrieve user & reviews
  useEffect(() => {
    if (userId && typeof userId === 'string' && isAppLoaded) {
      userAsync({
        variables: { id: userId },
        onSuccess: (d) => {
          saveDataInAsyncStore(USER_PROFILE, d);
        },
      });
      getUserReviewsAsync({ variables: { userId } });
    }
  }, [isMyProfile, isAppLoaded]);

  //retrieve contractor
  useEffect(() => {
    if (userId && typeof userId === 'string' && isContractor(user?.userTypes)) {
      contractorAsync({ variables: { userId } });
    }
  }, [userId, user]);

  useEffect(() => {
    if (contractorData?.id) {
      getContractorPortfoliosAsync({ variables: { contractorId: contractorData?.id } });
    }
  }, [contractorData]);

  return (
    <>
      <ScrollView style={styles.profileCont}>
        {loading || contrLoading || reviewLoading ? (
          <CustomContentLoader type="jobCard" size={20} repeat={1} />
        ) : (
          <>
            <ProfileHeader userData={user} reviewData={userReviews} isMyProfile={isMyProfile} />
            <View style={styles.profileBody}>
              {(user?.bio || isMyProfile) && <UserBio user={user} isMyProfile={isMyProfile} />}
              {isContractor(user?.userTypes) && (
                <>
                  <UserSkills
                    contractor={contractorData}
                    userSkills={contractorData?.skills}
                    isMyProfile={isMyProfile}
                  />
                  <UserLicenses
                    contractorData={contractorData}
                    licenses={contractorData?.licenses}
                    isMyProfile={isMyProfile}
                  />
                  <UserPortfolios
                    contractorData={contractorData}
                    portfolios={userPortfolios}
                    isMyProfile={isMyProfile}
                  />
                  {userReviews?.totalCount && userReviews?.totalCount > 0 ? (
                    <UserReview user={user} userReviews={userReviews} isMyProfile={isMyProfile} />
                  ) : (
                    <></>
                  )}
                </>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
};

export default Profile;

const getStyles = (theme: any) =>
  StyleSheet.create({
    profileCont: {
      backgroundColor: theme.white,
    },
    profileBody: {
      backgroundColor: theme.bg,
      padding: 20,
    },
  });
