import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import ScreenContainer from '~/src/components/reusable/ScreenContainer';
import UserProfileSetup from '~/src/components/user/signUp/UserProfileSetup';
import labels from '~/src/constants/labels';

const profileSetup = () => {
  const { userType } = useLocalSearchParams();
  return (
    <ScreenContainer pageName={labels.signUp}>
      <UserProfileSetup userType={userType} />
    </ScreenContainer>
  );
};

export default profileSetup;
