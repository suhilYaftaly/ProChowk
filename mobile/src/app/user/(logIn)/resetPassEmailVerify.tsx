import ScreenContainer from '~/src/components/reusable/ScreenContainer';
import labels from '~/src/constants/labels';
import EmailVerifyResetPass from '~/src/components/user/login/EmailVerifyResetPass';
import { useLocalSearchParams } from 'expo-router';

const resetPassEmailVerify = () => {
  const params = useLocalSearchParams();
  return (
    <ScreenContainer pageName={labels.forgotPass}>
      <EmailVerifyResetPass email={params?.email} />
    </ScreenContainer>
  );
};

export default resetPassEmailVerify;
