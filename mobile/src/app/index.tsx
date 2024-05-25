import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { getValueFromLocalStorage } from '../utils/secureStore';
import { USER_PROFILE, USER_VIEW } from '../constants/localStorageKeys';
import { Redirect } from 'expo-router';
import Routes from '../routes/Routes';
import { useAppDispatch } from '../utils/hooks/hooks';
import { setAppLoaded } from '../redux/slices/settingsSlice';
import { getDataFromAsyncStore } from '../utils/asyncStorage';
import { setUserProfile } from '../redux/slices/userSlice';

const home = () => {
  const dispatch = useAppDispatch();
  const userType = getValueFromLocalStorage(USER_VIEW);
  const checkForLoggedInUser = async () => {
    const userProfile = await getDataFromAsyncStore(USER_PROFILE);
    if (userProfile) {
      dispatch(setUserProfile(userProfile));
    }
  };
  useEffect(() => {
    dispatch(setAppLoaded(true));
    checkForLoggedInUser();
  }, []);

  if (userType === 'Contractor') return <Redirect href={`/${Routes.contractorHome}`} />;
  else return <Redirect href={`/${Routes.clientHome}`} />;

  return <View></View>;
};

export default home;
