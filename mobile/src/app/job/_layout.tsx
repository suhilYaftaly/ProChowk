import React from 'react';
import { Stack } from 'expo-router';

const JobLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="postJobPage"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default JobLayout;
