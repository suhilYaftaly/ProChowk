import React from 'react';
import { Stack } from 'expo-router';

const signUpLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="signUp" />
      <Stack.Screen name="profileSetup" />
    </Stack>
  );
};

export default signUpLayout;
