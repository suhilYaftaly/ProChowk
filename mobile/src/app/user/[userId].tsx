import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import Profile from '~/src/components/user/profile/Profile';

const userProfile = () => {
  const { userId } = useLocalSearchParams();
  return <Profile userId={userId} />;
};

export default userProfile;
