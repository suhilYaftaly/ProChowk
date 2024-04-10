import React from 'react';
import { Stack } from 'expo-router';

const signInLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="logIn" />
      <Stack.Screen name="forgotPassword" />
      <Stack.Screen name="resetPassEmailVerify" />
      <Stack.Screen name="changePass" />
    </Stack>
  );
};

export default signInLayout;
