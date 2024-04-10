import ScreenContainer from '~/src/components/reusable/ScreenContainer';
import labels from '~/src/constants/labels';
import UserLogIn from '~/src/components/user/login/UserLogIn';

const logIn = () => {
  return (
    <ScreenContainer pageName={labels.signIn}>
      <UserLogIn />
    </ScreenContainer>
  );
};

export default logIn;
