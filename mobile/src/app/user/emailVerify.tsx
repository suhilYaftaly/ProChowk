import React from 'react';
import ScreenContainer from '~/src/components/reusable/ScreenContainer';
import labels from '~/src/constants/labels';
import VerifyEmail from '~/src/components/user/signUp/VerifyEmail';

const emailVerify = () => {
  return (
    <ScreenContainer pageName={labels.emailVerification} hideHeader={true}>
      <VerifyEmail />
    </ScreenContainer>
  );
};

export default emailVerify;
