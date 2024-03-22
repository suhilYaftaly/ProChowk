import { StyleSheet } from 'react-native';
import React from 'react';
import ScreenContainer from '~/src/components/reusable/ScreenContainer';
import labels from '~/src/constants/labels';
import VerifyEmail from '~/src/components/user/VerifyEmail';

const emailVerify = () => {
  return (
    <ScreenContainer pageName={labels.emailVerification}>
      <VerifyEmail />
    </ScreenContainer>
  );
};

export default emailVerify;

const styles = StyleSheet.create({});
