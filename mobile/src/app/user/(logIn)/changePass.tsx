import ScreenContainer from '~/src/components/reusable/ScreenContainer';
import labels from '~/src/constants/labels';
import ChangePassword from '~/src/components/user/login/ChangePassword';

const changePass = () => {
  return (
    <ScreenContainer pageName={labels.forgotPass}>
      <ChangePassword />
    </ScreenContainer>
  );
};

export default changePass;
