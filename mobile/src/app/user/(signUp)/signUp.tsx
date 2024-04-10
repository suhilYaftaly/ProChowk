import React from 'react';
import UserSignUp from '~/src/components/user/signUp/UserSignUp';
import labels from '~/src/constants/labels';
import ScreenContainer from '~/src/components/reusable/ScreenContainer';

const signUp = () => {
  return (
    <ScreenContainer pageName={labels.signUp}>
      <UserSignUp />
    </ScreenContainer>
  );
};

export default signUp;
