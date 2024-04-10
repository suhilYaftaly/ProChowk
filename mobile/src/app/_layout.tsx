import { useFonts } from 'expo-font';
import { Stack, SplashScreen } from 'expo-router';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TamaguiProvider } from 'tamagui';
import config from '../../tamagui.config';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApolloProvider } from '@apollo/client';
import { client } from '../graphql/apollo-client';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../config/ToastConfig';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter: require('~/assets/fonts/Mulish.ttf'),
    InterBold: require('~/assets/fonts/Mulish-Bold.ttf'),
    InterBlack: require('~/assets/fonts/Mulish-Black.ttf'),
    InterItalic: require('~/assets/fonts/Mulish-Italic.ttf'),
    InterMedium: require('~/assets/fonts/Mulish-Medium.ttf'),
    InterSemiBold: require('~/assets/fonts/Mulish-SemiBold.ttf'),
    InterExtraBold: require('~/assets/fonts/Mulish-ExtraBold.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <TamaguiProvider config={config}>
          <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Stack>
                <Stack.Screen
                  name="(drawer)"
                  options={{ headerShown: false, gestureEnabled: false }}
                />
                <Stack.Screen name="user" options={{ headerShown: false }} />
              </Stack>
              <Toast config={toastConfig} />
            </GestureHandlerRootView>
          </SafeAreaProvider>
        </TamaguiProvider>
      </Provider>
    </ApolloProvider>
  );
}
