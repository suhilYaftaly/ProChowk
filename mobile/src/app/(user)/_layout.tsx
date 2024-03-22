import React from 'react';
import { Stack } from 'expo-router';

const userLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="(signUp)" options={{ headerShown: false }} />
      <Stack.Screen name="emailVerify" options={{ headerShown: false }} />
      {/*  <Stack.Screen name="(user)/logIn" options={{ headerTitle: 'Log In' }} />
            <Stack.Screen
              name="(user)/dashboard"
              options={{
                headerShown: false,
                gestureEnabled: false,
              }}
            /> */}
    </Stack>
  );
};

export default userLayout;
