import React from 'react';
import ScreenContainer from '~/src/components/reusable/ScreenContainer';
import UserProfileSetup from '~/src/components/user/signUp/UserProfileSetup';
import labels from '~/src/constants/labels';

const profileSetup = () => {
  return (
    <ScreenContainer pageName={labels.signUp}>
      <UserProfileSetup />
    </ScreenContainer>
  );
};

export default profileSetup;
