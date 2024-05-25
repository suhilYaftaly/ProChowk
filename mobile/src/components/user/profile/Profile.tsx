import { StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';
import { ScrollView } from 'tamagui';
import { useSettingsStates, useUserStates } from '~/src/redux/reduxStates';
import { useUser } from '~/src/graphql/operations/user';
import { useContractor } from '~/src/graphql/operations/contractor';
import { useGetUserReviews } from '~/src/graphql/operations/review';
import { isContractor } from '~/src/utils/auth';
import colors from '~/src/constants/colors';
import ProfileHeader from './ProfileHeader';
import CustomContentLoader from '../../reusable/CustomContentLoader';
import UserBio from './UserBio';
import UserSkills from './UserSkills';
import UserLicenses from './UserLicenses';
import UserReview from './UserReview';
import { USER_PROFILE } from '~/src/constants/localStorageKeys';
import { saveDataInAsyncStore } from '~/src/utils/asyncStorage';

type Props = {
  userId?: string | string[];
};

const Profile = ({ userId }: Props) => {
  const { user: loggedInUser } = useUserStates();
  const { isAppLoaded } = useSettingsStates();
  const isMyProfile = userId === loggedInUser?.id;
  const { userAsync, data: userData, loading } = useUser();
  const { contractorAsync, data: contrData, loading: contrLoading } = useContractor();
  const { getUserReviewsAsync, data: reviewsData, loading: reviewLoading } = useGetUserReviews();
  const user = userData?.user;
  const userReviews = reviewsData?.getUserReviews;
  const contractorData = contrData?.contractor;

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

  return (
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
                <UserReview user={user} userReviews={userReviews} isMyProfile={isMyProfile} />
              </>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  profileCont: {},
  profileBody: {
    backgroundColor: colors.bg,
    padding: 20,
  },
});
