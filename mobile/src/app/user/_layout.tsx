import React from 'react';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import labels from '~/src/constants/labels';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

const userLayout = () => {
  const { top } = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  return (
    <Stack>
      <Stack.Screen name="(signUp)" options={{ headerShown: false }} />
      <Stack.Screen name="(logIn)" options={{ headerShown: false }} />
      <Stack.Screen name="emailVerify" options={{ headerShown: false }} />
      <Stack.Screen
        name="[userId]"
        options={{
          header(props) {
            return (
              <View style={[styles.headerBar, { marginTop: top }]}>
                <Pressable style={styles.headerBackBtn} onPress={() => router.back()}>
                  <FontAwesome6 name="chevron-left" size={17} color="#fff" />
                  <Text style={styles.pageName}>{labels.profile}</Text>
                </Pressable>
              </View>
            );
          },
        }}
      />
    </Stack>
  );
};

export default userLayout;

const getStyles = (theme: any) =>
  StyleSheet.create({
    headerBar: {
      backgroundColor: theme.secondaryDark,
      paddingHorizontal: 15,
      paddingVertical: 20,
    },
    headerBackBtn: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    pageName: {
      fontFamily: 'InterExtraBold',
      fontSize: 18,
      color: '#fff',
      marginLeft: 10,
    },
  });
