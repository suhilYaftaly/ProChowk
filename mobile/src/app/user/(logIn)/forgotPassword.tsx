import ScreenContainer from '~/src/components/reusable/ScreenContainer';
import labels from '~/src/constants/labels';
import ForgotPassword from '~/src/components/user/login/ForgotPassword';

const forgotPassword = () => {
  return (
    <ScreenContainer pageName={labels.forgotPass}>
      <ForgotPassword />
    </ScreenContainer>
  );
};

export default forgotPassword;
