import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { YStack } from 'tamagui';

export default function NotFoundScreen() {
  return (
    <View>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View>
        <YStack>
          <Text>This screen doesn't exist.</Text>
          <Link href="/">
            <Text>Go to home screen!</Text>
          </Link>
        </YStack>
      </View>
    </View>
  );
}
