import { View, Text } from 'react-native';
import React from 'react';
import { Button } from 'tamagui';
import { router } from 'expo-router';

const job = () => {
  return (
    <View>
      <Button onPress={() => router.push('/emailVerify')}>Router Check</Button>
    </View>
  );
};

export default job;
